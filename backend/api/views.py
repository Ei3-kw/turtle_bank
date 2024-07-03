from django.shortcuts import render
from rest_framework import generics, status
from .models import UserRequest
from .serialisers import UserRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response



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


