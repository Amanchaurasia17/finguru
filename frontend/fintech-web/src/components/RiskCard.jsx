export default function RiskCard({ riskProfile }) {
  const colorMap = {
    low: "bg-green-200 text-green-800",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-red-200 text-red-800",
  };

  return (
    <div
      className={`p-5 rounded shadow-md ${colorMap[riskProfile] || "bg-gray-200"}`}
    >
      <h3 className="text-xl font-semibold mb-2">Your Risk Profile</h3>
      <p className="text-lg capitalize">{riskProfile}</p>
    </div>
  );
}
