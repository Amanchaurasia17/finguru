const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/save-tax/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const taxInput = req.body;

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.taxData = taxInput; // directly assign tax data to nested object
    await user.save();

    res.json({ message: "Tax data saved to user successfully." });
  } catch (error) {
    console.error("Error saving tax data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

