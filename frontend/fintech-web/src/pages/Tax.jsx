
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function TaxForm() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    salaryIncome: '',
    businessIncome: '',
    otherIncome: '',
    investment80C: '',
    healthInsurance80D: '',
    educationLoan80E: '',
    homeLoanInterest: '',
    rentPaid: ''
  });

  const [result, setResult] = useState(null);

  const descriptions = {
    salaryIncome: 'Total salary received annually',
    businessIncome: 'Profit earned from business annually',
    otherIncome: 'Income from other sources like interest, rent, etc.',
    investment80C: 'Investments under Section 80C (e.g., PPF, ELSS, LIC)',
    healthInsurance80D: 'Health insurance premium paid (Sec 80D)',
    educationLoan80E: 'Interest paid on education loan (Sec 80E)',
    homeLoanInterest: 'Interest on home loan (Sec 24B)',
    rentPaid: 'Rent paid (eligible under 80GG if no HRA)',
  };

  const formatCurrency = (value) =>
    value?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsed = Number(value);
    if (parsed < 0) {
      alert("Negative values are not allowed.");
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = currentUser?.uid;
    if (!uid) return alert("User not authenticated");

    const numericFormData = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, Number(v) || 0])
    );

    try {
      await axios.post(`http://localhost:5000/api/user/save-tax/${uid}`, numericFormData);
      const response = await axios.get(`http://localhost:5000/api/tax-optimization/${uid}`);
      setResult(response.data);
    } catch (err) {
      console.error("Error:", err.message);
      alert("Something went wrong while optimizing tax!");
    }
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(`http://localhost:5000/api/tax-optimization/send-email/${currentUser.uid}`);
      alert("📧 Tax report sent to your email!");
    } catch (err) {
      alert("❌ Failed to send email!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
          🧾 Income & Tax Deduction Details
        </h2>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="capitalize block font-semibold mb-1">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder={descriptions[key]}
            />
            <small className="text-gray-500">{descriptions[key]}</small>
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full mt-4 hover:bg-blue-700"
        >
          🔍 Submit & Optimize Tax
        </button>
      </form>

      {result && (
        <div className="mt-6 border p-6 rounded shadow bg-gray-100">
          <h2 className="text-xl font-bold text-green-700 mb-3">💡 Tax Optimization Result</h2>

          <p><strong>Total Income:</strong> {formatCurrency(result.annualIncome)}</p>

          <h3 className="mt-4 font-semibold">🧾 Deduction Breakdown</h3>
          <ul className="list-disc ml-6">
            {Object.entries(result.deductions || {}).map(([key, value]) => (
              <li key={key}>
                {(key === 'standardDeductionOld' && 'Standard Deduction (Old Regime)') ||
                 (key === 'standardDeductionNew' && 'Standard Deduction (New Regime)') ||
                 descriptions[key] || key}: {formatCurrency(value)}
              </li>
            ))}
          </ul>

          <h3 className="mt-4 font-semibold">📊 Tax Comparison</h3>
          <table className="w-full text-left border mt-2">
            <thead>
              <tr>
                <th className="border px-2 py-1">Regime</th>
                <th className="border px-2 py-1">Tax Payable</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">Old Regime</td>
                <td className="border px-2 py-1">{formatCurrency(result.oldRegimeTax)}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">New Regime</td>
                <td className="border px-2 py-1">{formatCurrency(result.newRegimeTax)}</td>
              </tr>
            </tbody>
          </table>

          {(result.oldRegimeTax === 0 && result.newRegimeTax === 0) ? (
            <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-600 rounded">
              🎉 <strong>No tax payable under either regime!</strong>
            </div>
          ) : (
            <>
              {result.suggestions?.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-600 rounded">
                  <h3 className="font-semibold mb-2">📌 Suggestions to Save More Tax:</h3>
                  <ul className="list-disc ml-6">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommended && (
                <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-600 rounded">
                  <strong>✅ Recommended Regime:</strong>{" "}
                  <span className="uppercase text-green-700">{result.recommended}</span>
                  <br />
                  {result.recommended === 'old'
                    ? 'Old Regime is better due to deductions reducing your tax liability.'
                    : 'New Regime is better likely due to your lower income and fewer deductions.'}
                </div>
              )}
            </>
          )}

          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSendEmail}
          >
            📧 Send Report via Email
          </button>

          <a
            href="https://cleartax.in/s/income-tax-return-filing"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-center text-white bg-green-600 rounded py-2 hover:bg-green-700"
          >
            🧾 File Tax Now
          </a>
        </div>
      )}
    </div>
  );
}
