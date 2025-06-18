


import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadTransactions } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

const riskOptions = [
  { value: "", label: "Select Risk Appetite" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

// Survey Questions
const surveyQuestions = [
  "What is your age?",
  "What is your primary financial goal?",
  "How would you react if your investment drops 20% in a month?",
  "How long can you stay invested without needing the money?",
  "How familiar are you with financial products like stocks and mutual funds?",
  "What percentage of your income do you save monthly?",
  "What’s your reaction to market news or volatility?",
  "Have you invested in risky assets (e.g., stocks, crypto) before?",
  "Would you prefer guaranteed returns over potentially higher returns with risk?",
  "Are you comfortable with locking your money for over 5 years?"
];

const surveyOptions = [
  ["Under 25", "25–40", "41–60", "Above 60"],
  ["Wealth creation", "Retirement", "Short-term needs", "Capital preservation"],
  ["Buy more", "Hold tight", "Re-evaluate", "Sell immediately"],
  ["More than 5 years", "3–5 years", "1–3 years", "Less than 1 year"],
  ["Expert", "Good", "Basic", "Beginner"],
  ["Above 30%", "15–30%", "5–15%", "Less than 5%"],
  ["Ignore", "Stay calm", "Get nervous", "Panic sell"],
  ["Frequently", "Occasionally", "Rarely", "Never"],
  ["No, I prefer risk", "Depends on situation", "Prefer safe", "Always guaranteed"],
  ["Yes", "Maybe", "Only if necessary", "Not comfortable"]
];

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [riskAppetite, setRiskAppetite] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [file, setFile] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState(Array(10).fill(""));

  const { refreshUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setRiskAppetite(data.riskAppetite || "");
        setMonthlyIncome(data.monthlyIncome || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await updateProfile({ name, phone, riskAppetite, monthlyIncome });
      alert("Profile Updated!");
      refreshUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a JSON file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadTransactions(formData);
      alert("Transactions uploaded successfully!");
      setFile(null);
    } catch (error) {
      alert("Failed to upload transactions.");
      console.error(error);
    }
  };

  const handleSurveyChange = (qIndex, value) => {
    const updated = [...surveyAnswers];
    updated[qIndex] = value;
    setSurveyAnswers(updated);
  };

  const calculateRiskFromSurvey = () => {
    let score = 0;

    surveyAnswers.forEach((answer, i) => {
      const index = surveyOptions[i].indexOf(answer);
      const reverseScore = 3 - index; // High-risk answers have lower index
      score += reverseScore;
    });

    if (score <= 12) return "High";
    if (score <= 20) return "Medium";
    return "Low";
  };

  const handleSubmitSurvey = () => {
    if (surveyAnswers.includes("")) {
      alert("Please answer all questions.");
      return;
    }

    const risk = calculateRiskFromSurvey();
    setRiskAppetite(risk);
    setShowSurvey(false);
    alert(`Your risk appetite has been evaluated as: ${risk}`);
  };

  return (
    <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mt-2 animate-fade-in">
      <h2 className="text-2xl font-extrabold text-[#0a3c4c] mb-2 flex items-center gap-2">
        <span className="text-green-500">👤</span> Profile
      </h2>
      <p className="text-[#0a3c4c] mb-4 text-sm">
        Update your personal information and risk appetite.
      </p>

      {!showSurvey ? (
        <>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold text-[#0a3c4c] mb-1">Name</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-green-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0a3c4c] mb-1">Phone</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-green-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0a3c4c] mb-1">Risk Appetite</label>
              <select
                value={riskAppetite}
                onChange={(e) => setRiskAppetite(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-green-200"
              >
                {riskOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className="mt-2 text-sm text-blue-600 underline"
                onClick={() => setShowSurvey(true)}
              >
                Evaluate via Survey
              </button>
            </div>
            <div>
              <label className="block font-semibold text-[#0a3c4c] mb-1">Monthly Income</label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-green-200"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0a3c4c] mb-1">Upload Transactions (JSON)</label>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="w-full px-4 py-2 rounded-lg border border-green-200"
              />
              <button
                onClick={handleFileUpload}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl"
              >
                Upload
              </button>
            </div>
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl"
            >
              Update Profile
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#0a3c4c]">📝 Risk Appetite Survey</h3>
          {surveyQuestions.map((question, index) => (
            <div key={index}>
              <p className="font-medium text-[#0a3c4c] mb-1">{index + 1}. {question}</p>
              <select
                className="w-full px-4 py-2 rounded-lg border border-green-200"
                value={surveyAnswers[index]}
                onChange={(e) => handleSurveyChange(index, e.target.value)}
              >
                <option value="">-- Select an option --</option>
                {surveyOptions[index].map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSubmitSurvey}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl"
            >
              Submit Survey
            </button>
            <button
              onClick={() => setShowSurvey(false)}
              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
