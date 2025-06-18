import React, { useEffect, useState } from "react";
import axios from "axios";
import RiskCard from "../components/RiskCard";
import StockCard from "../components/StockCard";
import SIPCard from "../components/SIPCard";
import IPOCard from "../components/IPOCard";
import { useAuth } from "../context/AuthContext"; 

export default function Stock() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      setLoading(false);
      setError("User not logged in.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/stock-recommendation/${currentUser.uid}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
        console.log("API DATA:", res.data); 
      })
      .catch((err) => {
        console.error("API fetch error:", err);
        setError("Failed to load data.");
        setLoading(false);
      });
  }, [currentUser]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!data || !data.recommendations) return <div className="text-center p-10 text-gray-500">No data available.</div>;

  return (
    <div className="max-w-5xl mx-auto p-5 space-y-10">
      <h1 className="text-3xl font-bold mb-6">AI Stock Prediction</h1>

      {/* Risk Profile Card */}
      <RiskCard riskProfile={data.riskProfile} />

      {/* Stocks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Stocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.recommendations.stocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </section>

      {/* SIPs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">SIP Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.recommendations.sips.map((sip, idx) => (
            <SIPCard key={idx} sip={sip} />
          ))}
        </div>
      </section>

      {/* IPOs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming IPOs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.recommendations.ipos.map((ipo, idx) => (
            <IPOCard key={idx} ipo={ipo} />
          ))}
        </div>
      </section>
    </div>
  );
}
