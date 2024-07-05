# take instance of python object to JSON
from rest_framework import serializers
from .models import UserRequest

class UserRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserRequest
        fields = ["id", "goal", "timeFrame", "monthlyIncome", "spendingBehavior"]
