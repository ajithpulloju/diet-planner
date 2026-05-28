const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// All routes protected
router.use(protect);

// GET /api/user/profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ status: 'success', user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/user/profile
router.put('/profile', async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'age', 'gender', 'height', 'weight', 'activity', 'goal', 'stress', 'sleep', 'calorieGoal', 'bodyFat', 'bmi', 'targetWeight', 'streak', 'settings'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    res.json({ status: 'success', user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/user/password
router.put('/password', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!(await user.correctPassword(req.body.currentPassword))) return res.status(401).json({ status: 'error', message: 'Current password is wrong' });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ status: 'success', message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/user/favorites — toggle favorite food
router.post('/favorites', async (req, res) => {
  try {
    const { foodId } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.favorites.indexOf(foodId);
    if (idx === -1) user.favorites.unshift(foodId);
    else user.favorites.splice(idx, 1);
    await user.save();
    res.json({ status: 'success', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/user/recent — add to recent foods
router.post('/recent', async (req, res) => {
  try {
    const { foodId } = req.body;
    const user = await User.findById(req.user._id);
    user.recent = user.recent.filter(id => id !== foodId);
    user.recent.unshift(foodId);
    if (user.recent.length > 20) user.recent.pop();
    await user.save();
    res.json({ status: 'success', recent: user.recent });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/user/metrics — log weight/body fat
router.post('/metrics', async (req, res) => {
  try {
    const { date, weight, bmi, bodyFat } = req.body;
    const user = await User.findById(req.user._id);
    user.metricsHistory.push({ date, weight, bmi, bodyFat });
    if (weight) user.weight = weight;
    if (bmi) user.bmi = bmi;
    if (bodyFat) user.bodyFat = bodyFat;
    await user.save();
    res.json({ status: 'success', metricsHistory: user.metricsHistory });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
