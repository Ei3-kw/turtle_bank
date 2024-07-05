# from math import ceil

# def income(t):
#     return 10000

# def essential(t):
#     return 0

# def planner(goalAmount, period, interest=0.05):
#     m = ceil(period / 30)
#     n = interest / 12
#     _plans = {}

#     def V(t, s):
#         # No longer possible
#         if s > sum((income(i) - essential(i)) * (1+n)**(m-i) for i in range(t, m+1)):
#             return (float("infinity"), "Infeasible")

#         if (t, s) not in _plans:
#             # Due date of the goal
#             if t == m:
#                 _plans[t, s] = (s, s)
#             if s <= 0:
#                 _plans[t, s] = (0, 0)
#             else: # explore the action space $X_t$ to find the optimal saving strategy
#                 # that minimises the total saving amount
#                 _plans[t, s] = min((x + V(t+1, s-x*(1+n)**(m-t))[0], x)
#                     for x in range(0, min(income(t)-essential(t), int(s))))
#         return _plans[t, s]

#     return V(0, goalAmount)


# if __name__ == '__main__':
#     print(planner(10000, 31))

import numpy as np

def deep_merge(dict1, dict2):
    result = dict1.copy()
    for key, value in dict2.items():
        if isinstance(value, dict):
            result[key] = deep_merge(result.get(key, {}), value)
        else:
            result[key] = value
    return result

def sum_amounts(data, x='Amount'):
    total = 0
    for category in data.values():
        total += category[x]
    return total

def add_suggestion(data):
    for category, values in data.items():
        values["SuggestionAmount"] = values["Amount"]
    return data

def income(t):
    return 10000

def essential(t):
    return 6900

def planner(goal_amount, period, interest=0.05):
    m = int(np.ceil(period / 30))  # number of months
    n = interest / 12  # monthly interest rate

    # Initialize the value function array
    V = np.full((m + 1, goal_amount + 1), np.inf)

    # Base case: At the goal date, V[m][s] = s
    V[m, :] = np.arange(goal_amount + 1)

    # Dynamic Programming
    for t in range(m - 1, -1, -1):
        max_possible_savings = sum((income(i) - essential(i)) * (1 + n) ** (m - i) for i in range(t, m))

        for s in range(goal_amount + 1):
            if s > max_possible_savings:
                V[t, s] = np.inf
            else:
                max_savings = min(income(t) - essential(t), s)
                possible_actions = np.arange(max_savings + 1)
                future_values = V[t + 1, np.maximum(0, s - possible_actions * (1 + n) ** (m - t)).astype(int)]
                V[t, s] = np.min(possible_actions + future_values)

    # Reconstruct the optimal saving strategy
    savings_plan = []
    s = goal_amount
    for t in range(m):
        max_savings = min(income(t) - essential(t), s)
        possible_actions = np.arange(max_savings + 1)
        future_values = V[t + 1, np.maximum(0, s - possible_actions * (1 + n) ** (m - t)).astype(int)]
        optimal_action = np.argmin(possible_actions + future_values)
        savings_plan.append(optimal_action)
        s = max(0, s - optimal_action * (1 + n) ** (m - t))

    return V[0, goal_amount], savings_plan

if __name__ == '__main__':
    goal_amount = 100000
    period = 3201
    min_savings, savings_plan = planner(goal_amount, period)
    print(f"Minimum total savings needed: {min_savings}")
    print(f"Optimal savings plan: {savings_plan}")