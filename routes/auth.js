const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const userObj = { _id: user._id, name: user.name, email: user.email, age: user.age, gender: user.gender, height: user.height, weight: user.weight, activity: user.activity, goal: user.goal, stress: user.stress, sleep: user.sleep, calorieGoal: user.calorieGoal, bodyFat: user.bodyFat, bmi: user.bmi, streak: user.streak, favorites: user.favorites, recent: user.recent, settings: user.settings };
  res.status(statusCode).json({ status: 'success', token, user: userObj });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, age, gender, height, weight, activity, goal, stress, sleep } = req.body;
    if (!name || !email || !password) return res.status(400).json({ status: 'error', message: 'Name, email and password are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ status: 'error', message: 'Email already registered' });
    // Calculate calorie goal if metrics are provided
    let calorieGoal;
    if (weight && height && age) {
      let bmr = gender === 'female' ? (10 * weight) + (6.25 * height) - (5 * age) - 161 : (10 * weight) + (6.25 * height) - (5 * age) + 5;
      let tdee = bmr * (activity || 1.55);
      calorieGoal = goal === 'cut' ? Math.round(tdee - 500) : goal === 'bulk' ? Math.round(tdee + 300) : Math.round(tdee);
    }
    const user = await User.create({ name, email, password, age, gender, height, weight, activity, goal, stress, sleep, calorieGoal });
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password))) return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
