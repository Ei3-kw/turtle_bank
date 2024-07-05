import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simulated data for the chart
const balanceData = [
        { date: '2023-01', balance: 5000 },
        { date: '2023-02', balance: 5500 },
        { date: '2023-03', balance: 4800 },
        { date: '2023-04', balance: 6000 },
        { date: '2023-05', balance: 6200 },
        { date: '2023-06', balance: 5900 },
];

const AccountTotals = () => (
    <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Account Total</h2>
            <p className="text-3xl font-bold text-indigo-600">$6,200.00</p>
    </div>
);

const SpendingCategory = () => (
    <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Top Spending Category</h2>
            <p className="text-xl">Food & Dining</p>
            <p className="text-2xl font-bold text-indigo-600">$850.00</p>
    </div>
);

const BalanceChart = () => (
    <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Historical Account Balance</h2>
            <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={balanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="balance" stroke="#4F46E5" strokeWidth={2} />
                    </LineChart>
            </ResponsiveContainer>
    </div>
);

const TransactionHistory = () => (
    <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
            <div className="overflow-y-auto h-64">
                    {/* Simulated transaction data */}
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b">
                                <div>
                                        <p className="font-semibold">Transaction {index + 1}</p>
                                        <p className="text-sm text-gray-500">2023-06-{(index + 1).toString().padStart(2, '0')}</p>
                                </div>
                                <p className={`font-bold ${index % 2 === 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {index % 2 === 0 ? '-' : '+'}${(Math.random() * 100).toFixed(2)}
                                </p>
                        </div>
                    ))}
            </div>
    </div>
);

const Dashboard = () => (
    <div className="grid grid-cols-2 gap-6 h-full">
            <div className="col-span-2 grid grid-cols-2 gap-6">
                    <AccountTotals />
                    <SpendingCategory />
            </div>
            <div className="col-span-2">
                    <BalanceChart />
            </div>
            <div className="col-span-2">
                    <TransactionHistory />
            </div>
    </div>
);

export {Dashboard}