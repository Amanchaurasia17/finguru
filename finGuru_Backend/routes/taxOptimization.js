const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { getOptimizedTax } = require("../utils/taxOptimizer");
const sendTaxEmail = require("../utils/sendEmail");

router.get("/:uid", async (req, res) => {
    console.log("Tax optimization API called for", req.params.uid);
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user || !user.taxData) {
      return res.status(404).json({ message: "User or tax data not found" });
    }

    const result = getOptimizedTax(user.taxData);
    res.json(result);
  } catch (err) {
    console.error("Tax optimization error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/send-email/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user || !user.taxData) return res.status(404).json({ message: "No tax data found" });

    const result = getOptimizedTax(user.taxData);
    await sendTaxEmail(user.email, { ...result, ...user.taxData });

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
