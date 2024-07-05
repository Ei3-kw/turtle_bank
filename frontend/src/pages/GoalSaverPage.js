import React, { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const placeholders = [
    "I would like to buy a Canon RP Camera Body",
    "I want to save for a 7 days photography trip to Japan",
    "I need to pay off my $100,000 student loans",
    "I'm need to for a save a 20% down payment on a 1.2 Million house",
    "I want to build an emergency fund for myself"
];

const GoalSaverPage = () => {
    const [goal, setGoal] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [monthlyExpense, setMonthlyExpense] = useState('');
    const [placeholder, setPlaceholder] = useState(placeholders[0]);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [minimisingSaving, setMinimisingSaving] = useState(false);
    const [spendingBehaviors, setSpendingBehaviors] = useState([
    ]);
    const [newCategory, setNewCategory] = useState("");
    const [newPercentage, setNewPercentage] = useState("");
    const [newAmount, setNewAmount] = useState("");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);

    const handleAddBehavior = (e) => {
        e.preventDefault();
        if (newCategory && newPercentage && newAmount) {
            setSpendingBehaviors([
                ...spendingBehaviors,
                {
                    category: newCategory,
                    percentage: parseFloat(newPercentage),
                    amount: parseFloat(newAmount)
                }
            ]);
            setNewCategory("");
            setNewPercentage("");
            setNewAmount("");
        }
    };

    const handleRemoveBehavior = (index) => {
        setSpendingBehaviors(spendingBehaviors.filter((_, i) => i !== index));
    };

    const handleEditBehavior = (index, field, value) => {
        const updatedBehaviors = [...spendingBehaviors];
        updatedBehaviors[index][field] = field === 'category' ? value : parseFloat(value);
        setSpendingBehaviors(updatedBehaviors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setAiSuggestion(null);

        const today = new Date();
        const targetDateObj = new Date(targetDate);
        const timeframeInDays = differenceInDays(targetDateObj, today);

        const formattedSpendingBehavior = spendingBehaviors.reduce((acc, behavior) => {
            acc[behavior.category] = {
                Percentage: behavior.percentage / 100,
                Amount: behavior.amount
            };
            return acc;
        }, {});

        const formattedData = {
            id: 1,
            goal: goal,
            timeFrame: timeframeInDays,
            monthlyIncome: parseFloat(monthlyIncome),
            monthlyExpense: parseFloat(monthlyExpense),
            spendingBehavior: formattedSpendingBehavior,
            minimisingSaving: minimisingSaving
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/userrequest/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            if (data && data.claude_response) {
                setAiSuggestion(data.claude_response);
            } else {
                console.log(response);
                throw new Error('Unexpected response structure from API');
            }
        } catch (e) {
            console.error("There was a problem with the fetch operation: ", e);
            setError(`Failed to get AI suggestions: ${e.message}. Please check the console for more details and ensure the backend server is running.`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderComparisonChart = () => {
        if (!aiSuggestion) return null;

        const data = Object.entries(aiSuggestion.SpendingCategory).map(([category, values]) => ({
            name: category,
            Current: values.Amount,
            Suggested: values.SuggestionAmount
        }));

        return (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Expense Comparison</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Current" fill="#8884d8" />
                        <Bar dataKey="Suggested" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderSuggestionTable = () => {
        if (!aiSuggestion) return null;

        return (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">AI Suggestions</h2>
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border">Category</th>
                        <th className="px-4 py-2 border">Current Amount</th>
                        <th className="px-4 py-2 border">Suggested Amount</th>
                        <th className="px-4 py-2 border">Percentage</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(aiSuggestion.SpendingCategory).map(([category, values]) => (
                        <tr key={category}>
                            <td className="px-4 py-2 border">{category}</td>
                            <td className="px-4 py-2 border">${values.Amount.toFixed(2)}</td>
                            <td className="px-4 py-2 border">${values.SuggestionAmount.toFixed(2)}</td>
                            <td className="px-4 py-2 border">{values.Percentage.toFixed(1)}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <p className="font-bold">Goal Amount: ${aiSuggestion.GoalAmount.toFixed(2)}</p>
                    <p className="font-bold">Proposed Monthly Saving: ${aiSuggestion.ProposedMontlySaving.toFixed(2)}</p>
                    <p className="font-bold">Proposed Monthly Expense: ${aiSuggestion.ProposedMontlyExpense.toFixed(2)}</p>
                    <p className="font-bold mt-2">Overall Suggestion:</p>
                    <p>{aiSuggestion.OverallSuggestion}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-3xl font-bold text-indigo-600 mb-6">Set Your Savings Goal</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                        What would you like to save for?
                    </label>
                    <input
                        type="text"
                        id="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder={placeholder}
                    />
                </div>
                <div>
                    <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
                        When do you want to achieve this goal?
                    </label>
                    <input
                        type="date"
                        id="targetDate"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income
                    </label>
                    <input
                        type="number"
                        id="monthlyIncome"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="Enter your monthly income"
                    />
                </div>
                <div>
                    <label htmlFor="monthlyExpense" className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Expense
                    </label>
                    <input
                        type="number"
                        id="monthlyExpense"
                        value={monthlyExpense}
                        onChange={(e) => setMonthlyExpense(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="Enter your monthly expenses"
                    />
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={minimisingSaving}
                            onChange={(e) => setMinimisingSaving(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2 text-gray-700">Minimize Savings</span>
                    </label>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Spending Behaviors</h2>
                    {spendingBehaviors.map((behavior, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                                type="text"
                                value={behavior.category}
                                onChange={(e) => handleEditBehavior(index, 'category', e.target.value)}
                                className="flex-1 px-2 py-1 border rounded"
                            />
                            <input
                                type="number"
                                value={behavior.percentage}
                                onChange={(e) => handleEditBehavior(index, 'percentage', e.target.value)}
                                className="w-20 px-2 py-1 border rounded"
                                step="0.1"
                            />
                            <input
                                type="number"
                                value={behavior.amount}
                                onChange={(e) => handleEditBehavior(index, 'amount', e.target.value)}
                                className="w-24 px-2 py-1 border rounded"
                                step="0.01"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveBehavior(index)}
                                className="px-2 py-1 bg-red-500 text-white rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Category"
                            className="flex-1 px-2 py-1 border rounded"
                        />
                        <input
                            type="number"
                            value={newPercentage}
                            onChange={(e) => setNewPercentage(e.target.value)}
                            placeholder="Percentage"
                            className="w-20 px-2 py-1 border rounded"
                            step="0.1"
                        />
                        <input
                            type="number"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            placeholder="Amount"
                            className="w-24 px-2 py-1 border rounded"
                            step="0.01"
                        />
                        <button
                            type="button"
                            onClick={handleAddBehavior}
                            className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                            Add
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-8 py-3 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-full px-8 py-3 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    disabled={isLoading}
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Goal'}
                </button>
            </form>
            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}
            {isLoading && <p className="text-indigo-600 mt-4">Loading AI suggestions...</p>}
            {aiSuggestion && renderComparisonChart()}
            {aiSuggestion && renderSuggestionTable()}
        </div>
    );
};

export { GoalSaverPage };