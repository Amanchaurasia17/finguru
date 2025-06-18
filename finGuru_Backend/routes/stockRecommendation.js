const express = require("express");
const router = express.Router();
const User = require("../models/User");
const yahooFinance = require("yahoo-finance2").default;
const allSymbols = require("../data/stockSymbols");
const allSips = require("../data/sipList");
const allIPOs = require("../data/ipoList");

function calculateVolatility(prices) {
  if (prices.length < 2) return null;
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (returns.length - 1);
  return Math.sqrt(variance);
}

async function batchProcess(items, batchSize, handler) {
  let results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item) => handler(item).catch(() => null))
    );
    results.push(...batchResults);
  }
  return results.filter(Boolean);
}

// Helper to filter SIPs by risk and pick top N (here, top 5)
function getSipsByRisk(riskProfile, topN = 5) {
  const normalizedRisk = riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1).toLowerCase();
  const filtered = allSips.filter(sip => sip.risk === normalizedRisk);
  return filtered.slice(0, topN);
}

// Helper to filter IPOs by risk and pick top N
function getIPOsByRisk(riskProfile, topN = 5) {
  const normalizedRisk = riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1).toLowerCase();
  const filtered = allIPOs.filter(ipo => ipo.risk === normalizedRisk);
  return filtered.slice(0, topN);
}

router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    const pastDate = new Date();
    pastDate.setMonth(today.getMonth() - 3);

    const stockRiskData = await batchProcess(
      allSymbols,
      10,
      async (symbol) => {
        const history = await yahooFinance.historical(symbol, {
          period1: pastDate.toISOString().slice(0, 10),
          period2: today.toISOString().slice(0, 10),
          interval: "1d",
        });
        if (!history || history.length === 0) return null;

        const closes = history.map((d) => d.close);
        const volatility = calculateVolatility(closes);
        if (volatility === null) return null;

        return { symbol, volatility };
      }
    );

    stockRiskData.sort((a, b) => a.volatility - b.volatility);

    const lowRiskStocks = stockRiskData.slice(0, 10);
    const mediumRiskStocks = stockRiskData.slice(10, 20);
    const highRiskStocks = stockRiskData.slice(-10);

    const riskProfile = (user.riskAppetite || "Medium").toLowerCase();

    let selectedStocks;
    if (riskProfile === "low") selectedStocks = lowRiskStocks;
    else if (riskProfile === "medium") selectedStocks = mediumRiskStocks;
    else selectedStocks = highRiskStocks;

    const stocksDetailed = await Promise.all(
      selectedStocks.map(async (s) => {
        try {
          const quote = await yahooFinance.quote(s.symbol);
          return {
            symbol: s.symbol,
            currentPrice: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            percentChange: quote.regularMarketChangePercent,
            volatility: s.volatility,
            trend: quote.regularMarketChangePercent > 0 ? "Uptrend" : "Downtrend",
          };
        } catch {
          return null;
        }
      })
    );

    const filteredStocks = stocksDetailed.filter(Boolean);

    // Get top 5 SIPs and IPOs for the user's risk profile
    const filteredSips = getSipsByRisk(riskProfile, 5);
    const filteredIPOs = getIPOsByRisk(riskProfile, 5);

    res.json({
      riskProfile: riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1),
      recommendations: {
        stocks: filteredStocks,
        sips: filteredSips,
        ipos: filteredIPOs,
      },
    });
  } catch (error) {
    console.error("Error in /stock-recommendation/:uid:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
