from django.shortcuts import render
from rest_framework import generics, status
from .models import UserRequest
from .serialisers import UserRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .claude_utils import get_claude_response
import json


class UserRequestListCreate(generics.ListCreateAPIView):
    queryset = UserRequest.objects.all()
    serializer_class = UserRequestSerializer

    def delete(self, request, *args, **kwargs):
        UserRequest.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Get the Claude response for the newly created UserRequest
        user_request = serializer.instance
        claude_response = user_request.get()

        print(claude_response)
        # Parse the Claude response
        try:
            parsed_response = json.loads(claude_response)
        except json.JSONDecodeError:
            parsed_response = {"error": "Invalid response format from Claude"}

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

