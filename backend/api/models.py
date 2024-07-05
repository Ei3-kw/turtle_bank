from django import forms
from django.db import models
from django.core.exceptions import ValidationError
from .claude_utils import get_claude_response
from .helper import planner
import json


# Create your models here.
class UserRequest(models.Model):
    goal = models.CharField(max_length=200)
    timeFrame = models.IntegerField()
    minimisingSaving = models.BooleanField(default=False)
    monthlyIncome = models.FloatField()
    spendingBehavior = models.JSONField()  # For storing dict [category: percentage]

    def __str__(self):
        return self.goal

    def get_products(self):
        prompt = f"""
        Based on the following user information, suggest a list of items to purchase in Australia related to their goal.
        where GoalAmount = sum of the Price in Products

        DONOT response anything other than JSON

        User Information:
        Goal: {self.goal}
        Time Frame: {self.timeFrame} days
        Monthly Income: ${self.monthlyIncome}
        Spending Behavior: {json.dumps(self.spendingBehavior)}

        Provide the response in the specified JSON format if the request is realistic:
        {{
            "Goal": $goal,
            "GoalAmount": int,
            "TimeFrame": int,
            "Products": [
                {{"Product": $productName, "Price": int}},
                {{"Product": $productName, "Price": int}}...
                ]
        }}

        If the request is unrealistic or trolling, respond an error message in JSON format:
        {{"ERROR": "reason"}}

        Ensure all prices are in Australian dollars and are realistic for the Australian market.
        Include plane tickets & accommodation fee if it's travelling
        """

        return get_claude_response(prompt)

    def get_spendings(self, requiredSaving):
        prompt = f"""
        Based on the following user information
        give suggestions on changing spending behaviour
        Notice that:
            - rent and car expenses would mostly be fixed cost
            - people need to buy enough groceries to survive

        DONOT response anything other than JSON

        User Information:
        Goal: {self.goal}
        Time Frame: {self.timeFrame} days
        Monthly Income: ${self.monthlyIncome}
        Spending Behavior: {json.dumps(self.spendingBehavior)}

        Provide the response in the specified JSON format if the request is realistic:
        {{
            "OverallSuggestion": $overallSuggestion,
            "SpendingCategory": {{
                $category: {{
                    "Percentage": float,
                    "Amount": float,
                    "SuggestionAmount": float
                }}
            }}
        }}

        Proposed monthly spending should add up to at most {self.monthlyIncome - requiredSaving}
        Ensure all prices are in Australian dollars and are realistic for the Australian market.
        """
        return get_claude_response(prompt)

    # prompt = f"""
    #     Based on the following user information, suggest a list of items to purchase in Australia related to their goal.
    #     give suggestions on changing spending behaviour if ProposedMontlyExpense < current MontlyExpense
    #     Notice that rent and car expenses would mostly be fixed cost

    #     where
    #         - current MontlyExpense = sum(Spending Behavior)
    #         - GoalAmount = sum of the Price in Products
    #         - ProposedMonthlySaving = 30 * GoalAmount/ Time Frame

    #     DONOT response anything other than JSON

    #     User Information:
    #     Goal: {self.goal}
    #     Time Frame: {self.timeFrame} days
    #     Monthly Income: ${self.monthlyIncome}
    #     Spending Behavior: {json.dumps(self.spendingBehavior)}

    #     Provide the response in the specified JSON format if the request is realistic:
    #     {{
    #         "Goal": $goal,
    #         "GoalAmount": int
    #         "TimeFrame": int,
    #         "Products": [
    #             {{"Product": $productName, "Price": int}},
    #             {{"Product": $productName, "Price": int}}...
    #             ],
    #         "ProposedMonthlySaving": float,
    #         "ProposedMontlyExpense": float,
    #         "OverallSuggestion": $overallSuggestion,
    #         "SpendingCategory": {{
    #             $category: {{
    #                 "Percentage": float,
    #                 "Amount": float,
    #                 "SuggestionAmount": float
    #             }}
    #         }}
    #     }}

    #     If the request is unrealistic or trolling, respond an error message in JSON format:
    #     {{"ERROR": "reason"}}

    #     Ensure all prices are in Australian dollars and are realistic for the Australian market.
    #     """

