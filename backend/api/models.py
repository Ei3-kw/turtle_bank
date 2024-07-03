from django.db import models
from .claude_utils import get_claude_response
import json

# Create your models here.
class UserRequest(models.Model):
    # why not self.?
    goal = models.CharField(max_length=200)
    timeFrame = models.IntegerField()
    monthlyIncome = models.FloatField()
    monthlyExpense = models.FloatField()
    spendingBehavior = models.JSONField()  # For storing dict [category: percentage]

    def __str__(self):
        return self.goal

    def get(self):
        prompt = f"""
        Based on the following user information, suggest a list of items to purchase in Australia related to their goal.
        give suggestions on changing spending behaviour if necessary (current saving pace cannot reach the goal within time frame)
        Notice that rent and car expenses would mostly be fixed cost

        where
            - current saving of the month = Monthly Income - sum(Spending Behavior)
            - GoalAmount = sum of the Price in Products

        DONOT response anything other than JSON

        User Information:
        Goal: {self.goal}
        Time Frame: {self.timeFrame} days
        Monthly Income: ${self.monthlyIncome}
        Spending Behavior: {json.dumps(self.spendingBehavior)}

        Provide the response in the specified JSON format if the request is realistic:
        {{
            "Goal": $goal,
            "GoalAmount": int
            "TimeFrame": int,
            "Products": [
                {{"Product": $productName, "Price": int}},
                {{"Product": $productName, "Price": int}}...
                ],
            "ProposedMontlySaving": float,
            "ProposedMontlyExpense": float,
            "OverallSuggestion": $overallSuggestion,
            "SpendingCategory": {{
                $category: {{
                    "Percentage": float,
                    "Amount": float,
                    "SuggestionAmount": float
                }}
            }}
        }}

        If the request is unrealistic or trolling, respond an error message in JSON format:
        {{"error": "reason"}}

        Ensure all prices are in Australian dollars and are realistic for the Australian market.
        """

        return get_claude_response(prompt)

