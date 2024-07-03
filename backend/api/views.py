from django.shortcuts import render
from rest_framework import generics, status
from .models import UserRequest
from .serialisers import UserRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .claude_utils import get_claude_response


class UserRequestListCreate(generics.ListCreateAPIView):
    queryset = UserRequest.objects.all()
    serializer_class = UserRequestSerializer

    def delete(self, request, *args, **kwargs):
        UserRequest.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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

