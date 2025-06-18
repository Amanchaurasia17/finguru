const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');
const FormData = require('form-data');
const { Readable } = require('stream');


router.post('/classify-now/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ uid: userId });
    if (!user || !user.transactionsJson) {
      return res.status(404).json({ error: 'User or transactions not found' });
    }

    const rawTransactions = JSON.parse(user.transactionsJson);
    const jsonBuffer = Buffer.from(JSON.stringify(rawTransactions), 'utf-8');
    const form = new FormData();
    form.append('file', jsonBuffer, {
      filename: 'transactions.json',
      contentType: 'application/json'
    });

    const aiResponse = await axios.post(
      'https://navonmesh-1.onrender.com/classify-transactions',
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
        timeout: 3000 
      }
    );

    const classifiedTxns = aiResponse.data?.sample;
    if (!Array.isArray(classifiedTxns) || classifiedTxns.length === 0) {
      return res.status(500).json({
        error: 'AI returned empty or invalid classification',
        details: aiResponse.data
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid: userId },
      { $set: { classifiedTransactions: classifiedTxns } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found while saving classified data' });
    }

    res.json({
      success: true,
      message: '✅ Classification done and saved successfully.',
      data: classifiedTxns
    });
  } catch (error) {
    console.error('Classification error:', error?.response?.data || error.message || error);
    res.status(500).json({
      error: 'Failed to classify transactions',
      details: error?.response?.data || error.message
    });
  }
});

module.exports = router;