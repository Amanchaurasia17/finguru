const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

//Update user profile
const updateProfile = async (req, res) => {
  const { name, riskAppetite, phone } = req.body;

  try {
    let user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      // Create new user
      user = new User({
        uid: req.user.uid,
        email: req.user.email,
        name,
        phone,
        riskAppetite,
        monthlyIncome: req.body.monthlyIncome || 0,
        transactionsJson: '',
        classifiedTransactions: [],
        savingsTargetAmount: req.body.savingsTargetAmount || 0,
      });
    } else {
      // Update existing user
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.riskAppetite = riskAppetite || user.riskAppetite;
      user.monthlyIncome = req.body.monthlyIncome || user.monthlyIncome;
      user.savingsTargetAmount = req.body.savingsTargetAmount || user.savingsTargetAmount;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Upload transactions JSON
const uploadTransactionsJson = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const jsonString = req.file.buffer.toString();

    try {
      JSON.parse(jsonString); // Validate JSON
    } catch (e) {
      return res.status(400).json({ message: 'Invalid JSON file' });
    }

    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.transactionsJson = jsonString;
    await user.save();

    res.json({ message: 'Transactions JSON uploaded and saved to profile.' });
  } catch (err) {
    console.error('Error uploading transactions JSON:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// New: Update only savings target amount
const updateSavingsTargetAmount = async (req, res) => {
  const { uid } = req.params;
  const { savingsTargetAmount } = req.body; 

  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { savingsTargetAmount },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Savings target updated', user });
  } catch (err) {
    console.error('Error updating savings target:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  uploadTransactionsJson,
  updateSavingsTargetAmount
};
