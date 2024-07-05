from django.shortcuts import render
from rest_framework import generics, status
from .models import UserRequest
from .serialisers import UserRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .claude_utils import get_claude_response
from .helper import planner, deep_merge, sum_amounts, add_suggestion
import json


class UserRequestListCreate(generics.ListCreateAPIView):
    queryset = UserRequest.objects.all()
    serializer_class = UserRequestSerializer

    def delete(self, request, *args, **kwargs):
        UserRequest.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Get the Claude response for the newly created UserRequest
        user_request = serializer.instance

        # Parse the Claude response
        try:
            parsed_response = json.loads(user_request.get_products())

            if "ERROR" not in parsed_response:
                current_spending = sum_amounts(user_request.spendingBehavior)
                current_saving = user_request.monthlyIncome - current_spending
                required_saving = 30 * parsed_response["GoalAmount"] / user_request.timeFrame

                if not user_request.minimisingSaving:
                    if current_saving < required_saving:
                        claude_spending = json.loads(user_request.get_spendings(required_saving))
                        parsed_response["ProposedMonthlyExpense"] = sum_amounts(claude_spending["SpendingCategory"])
                        parsed_response["ProposedMonthlySaving"] = user_request.monthlyIncome - parsed_response["ProposedMonthlyExpense"]
                        parsed_response = deep_merge(parsed_response, claude_spending)
                    else:
                        parsed_response["ProposedMonthlyExpense"] = current_spending
                        parsed_response["ProposedMonthlySaving"] = current_saving
                        parsed_response["OverallSuggestion"] = "No need to change spending behaviour"
                        parsed_response["SpendingCategory"] = add_suggestion(user_request.spendingBehavior)
                else:
                    min_savings, savings_plan = planner(parsed_response['GoalAmount'], parsed_response['TimeFrame'])

        except json.JSONDecodeError:
            parsed_response = {"error": "Invalid response format from Claude"}
            return Response(parsed_response, status=status.HTTP_405_METHOD_NOT_ALLOWED)


        # Combine the serializer data with the Claude response
        response_data = {
            **serializer.data,
            "claude_response": parsed_response
        }

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


class UserRequestRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserRequest.objects.all()
    serializer_class = UserRequestSerializer
    lookup_field = "pk"


class ClaudeAPIView(APIView):
    def post(self, request):
        prompt = request.data.get('prompt')
        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        claude_response = get_claude_response(prompt)
        return Response({'response': claude_response})

