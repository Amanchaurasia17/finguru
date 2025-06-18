export default function StockCard({ stock }) {
  if (!stock) return null;
  const { symbol, currentPrice, change, percentChange, trend } = stock;

  const isValidNumber = (val) => typeof val === "number" && !isNaN(val);
  const changeColor = isValidNumber(change) && change >= 0 ? "text-green-600" : "text-red-600";
  const trendBadge = trend === "Uptrend" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-lg">{symbol || "N/A"}</h4>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${trendBadge}`}>
            {trend}
          </span>
        )}
      </div>
      <p>Current Price: ₹{isValidNumber(currentPrice) ? currentPrice.toFixed(2) : "N/A"}</p>
      <p className={changeColor}>
        Change: {isValidNumber(change) ? change.toFixed(2) : "N/A"} (
        {isValidNumber(percentChange) ? percentChange.toFixed(2) : "N/A"}%)
      </p>
    </div>
  );
}


