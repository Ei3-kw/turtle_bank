from django.shortcuts import render
from rest_framework import generics
from .models import UserRequest
from .serialisers import UserRequestSerializer

class UserRequestListCreate(generics.ListCreateAPIView):
    queryset = UserRequest.objects.all()
    serializer_class = UserRequestSerializer



