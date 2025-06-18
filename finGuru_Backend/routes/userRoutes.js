const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getProfile, updateProfile, uploadTransactionsJson,  updateSavingsTargetAmount } = require('../controllers/userController');
const multer = require('multer');
const upload = multer();
const User = require('../models/User');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.post('/profile', protect, updateProfile);
router.post('/transactions/upload', protect, upload.single('file'), uploadTransactionsJson);
router.put('/:uid/savings-target', updateSavingsTargetAmount);


router.get('/classified/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ uid: userId });
    if (!user || !Array.isArray(user.classifiedTransactions)) {
      return res.status(404).json([]);
    }
    res.json(user.classifiedTransactions);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:uid', async (req, res) => {
  const user = await User.findOne({ uid: req.params.uid });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});



module.exports = router;

