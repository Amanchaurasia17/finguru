import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Spending() {
  const { firebaseUser, currentUser } = useAuth();
  const [aiData, setAiData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetInput, setTargetInput] = useState('');
  const [savingStatus, setSavingStatus] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showChart, setShowChart] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const defaultCategoryAmounts = {
    "Groceries": 6642,
    "Food & Beverage": 4050,
    "Utilities": 3501,
    "Travel": 3050,
    "Healthcare": 2500,
    "Entertainment": 2304,
    "Shopping": 2500,
    "Refund": 1250,
    "Other": 7505
  };

  const fetchUserProfile = async () => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await axios.get(`http://localhost:5000/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data || null);
      setTargetInput(res.data?.savingsTargetAmount?.toString() || '');
    } catch (err) {
      console.error('User fetch error:', err);
      setErrorMessage('⚠️ Failed to fetch user profile.');
    }
  };

  const handleAIAnalysis = async () => {
    if (!currentUser) return;
    setAiLoading(true);
    setAiMessage('');
    try {
      const res = await axios.post(`http://localhost:5000/api/classify-now/${currentUser.uid}`);
      if (res.data.success) {
        const txnRes = await axios.get(`http://localhost:5000/api/user/${currentUser.uid}`);
        if (txnRes.data.length > 0) {
          setAiData(txnRes.data);
          setUseFallback(false);
          setAiMessage('✅ AI Analysis Complete!');
        } else {
          setUseFallback(true);
          setAiMessage('❌ No AI transactions found. Showing default data.');
        }
      } else {
        setUseFallback(true);
        setAiMessage('❌ AI classification failed. Showing default data.');
      }
    } catch (err) {
      console.error('AI error:', err);
      setUseFallback(true);
      // setAiMessage('❌ Error during AI classification. Showing default data.');
    } finally {
      setShowChart(true);
      setAiLoading(false);
      setTimeout(() => setAiMessage(''), 3000);
    }
  };

  useEffect(() => {
    if (firebaseUser && currentUser) {
      fetchUserProfile();
      setLoading(false);
    }
  }, [firebaseUser, currentUser]);

  const handleTargetSave = async () => {
    if (!targetInput || !currentUser) return;
    try {
      await axios.put(`http://localhost:5000/api/user/${currentUser.uid}/savings-target`, {
        savingsTargetAmount: Number(targetInput),
      });
      setUser({ ...user, savingsTargetAmount: Number(targetInput) });
      setSavingStatus('Saved!');
      setTimeout(() => setSavingStatus(''), 1500);
    } catch (err) {
      console.error('Target save error:', err);
      setSavingStatus('Error!');
    }
  };

  if (loading) return <p>Loading...</p>;

  let chartData = null;
  let totalSpending = 0;
  let tips = [];
  let actualSavings = 0;
  const categoryTotals = {};

  if (showChart) {
    if (useFallback) {
      for (const [cat, amt] of Object.entries(defaultCategoryAmounts)) {
        categoryTotals[cat] = amt;
        totalSpending += amt;
      }
    } else if (aiData) {
      aiData.forEach((txn) => {
        if (txn.type === 'debit') {
          const cat = txn.category?.trim() || 'Uncategorized';
          categoryTotals[cat] = (categoryTotals[cat] || 0) + txn.amount;
          totalSpending += txn.amount;
        }
      });
    }

    const labels = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    chartData = {
      labels,
      datasets: [
        {
          label: 'Spending by Category',
          data: amounts,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56',
            '#66bb6a', '#ba68c8', '#ff7043',
            '#4db6ac', '#9575cd', '#f06292',
            '#7986cb'
          ],
          borderWidth: 1,
          hoverOffset: 20
        }
      ]
    };

    const income = user?.monthlyIncome || 0;
    const savingsTarget = user?.savingsTargetAmount || 0;
    actualSavings = income - totalSpending;

    if (totalSpending > income) {
      tips.push("You've spent more than your income. Try cutting down on non-essentials.");
    }
    if (actualSavings < savingsTarget) {
      tips.push(`You're saving less than your target of ₹${savingsTarget}.`);
    }
    if (categoryTotals["Entertainment"] > 1000) {
      tips.push("🎬 Try limiting your entertainment expenses this month.");
    }
    if (categoryTotals["Food & Beverage"] > 3000) {
      tips.push("🍽️ Reduce frequent takeouts or dining out to cut food-related spending.");
    }
    if (categoryTotals["Shopping"] > 2000) {
      tips.push("🛍️ Delay non-essential shopping purchases or look for discounts.");
    }
    if (totalSpending > income * 0.8) {
      tips.push("Consider creating a strict budget to limit spending to under 80% of your income.");
    }
    tips.push("📌 Track daily expenses using a mobile app or journal to stay on target.");
    tips.push("💳 Automate savings transfers to ensure you save before spending.");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Spending Analysis</h1>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
          {errorMessage}
        </div>
      )}

      <div className="bg-white shadow rounded-xl p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            💰 Monthly Savings Target (₹):
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              className="border p-2 rounded w-1/2"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleTargetSave}
            >
              Update
            </button>
            {savingStatus && <span className="text-green-500">{savingStatus}</span>}
          </div>
        </div>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          onClick={handleAIAnalysis}
          disabled={aiLoading}
        >
          {aiLoading ? '🔄 Analysing...' : 'Analyse with AI 🤖'}
        </button>
        {aiMessage && <p className="text-sm text-blue-700 mt-2">{aiMessage}</p>}
      </div>

      {showChart && chartData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="bg-white shadow rounded-xl p-4">
            <Pie data={chartData} options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const value = context.parsed || 0;
                      return `${context.label}: ₹${value}`;
                    }
                  }
                },
                legend: { position: 'bottom' }
              }
            }} />
          </div>

          <div className="bg-white shadow rounded-xl p-4 space-y-3">
            <h2 className="text-xl font-semibold mb-2">📊 Spending Summary</h2>

            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>🧾 Total Spending:</strong> ₹{totalSpending}</p>
              <p><strong>💼 Monthly Income:</strong> ₹{user?.monthlyIncome || 0}</p>
              <p><strong>🎯 Target Savings:</strong> ₹{user?.savingsTargetAmount || 0}</p>
              <p><strong>💵 Actual Savings:</strong> ₹{actualSavings}</p>
              <p className={
                actualSavings >= user?.savingsTargetAmount
                  ? 'text-green-600'
                  : 'text-red-600'
              }>
                <strong>{actualSavings >= user?.savingsTargetAmount ? '✅ You have achieved your savings goal!' : '❗ You are below your savings goal.'}</strong>
              </p>
            </div>

            {actualSavings >= user?.savingsTargetAmount ? (
              <div className="mt-4 text-green-700 text-lg font-semibold flex flex-col items-center">
                <span>🎉 Congratulations! You have exceeded your savings goal this month.</span>
                <span>Keep up the great work and continue your smart spending habits! 🌟</span>
              </div>
            ) : tips.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-800 mb-1">💡 Suggestions to Improve:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-green-600 mt-4">You're doing great! Keep it up 🎉</p>
            )}
          </div>
        </div>
      ) : showChart && !chartData ? (
        <p className="mt-6 text-gray-500 text-center">No transactions to show.</p>
      ) : null}
    </div>
  );
}
