from django.db import models

# Create your models here.
class UserRequest(models.Model):
    # why not self.?
    goal = models.CharField(max_length=200)
    timeFrame = models.IntegerField()
    monthlyIncome = models.FloatField()
    monthlyExpense = models.FloatField()
    spendingBehavior = models.JSONField()  # For storing dict [category: percentage]
    age = models.IntegerField()
    occupation = models.CharField(max_length=100)

    def __str__(self):
        return self.goal

