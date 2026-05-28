const express = require('express');
const WeeklyPlan = require('../models/WeeklyPlan');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// GET /api/plans/weekly
router.get('/weekly', async (req, res) => {
  try {
    const week = req.query.week || getWeekKey();
    let plan = await WeeklyPlan.findOne({ userId: req.user._id, week });
    if (!plan) {
      const empty = { breakfast: [], lunch: [], snacks: [], dinner: [] };
      plan = { plans: { mon: { ...empty }, tue: { ...empty }, wed: { ...empty }, thu: { ...empty }, fri: { ...empty }, sat: { ...empty }, sun: { ...empty } } };
    }
    res.json({ status: 'success', week, plans: plan.plans });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/plans/weekly/:day
router.put('/weekly/:day', async (req, res) => {
  try {
    const { day } = req.params;
    const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    if (!validDays.includes(day)) return res.status(400).json({ status: 'error', message: 'Invalid day' });
    const week = req.query.week || getWeekKey();
    const { breakfast = [], lunch = [], snacks = [], dinner = [] } = req.body;
    const update = {};
    update[`plans.${day}`] = { breakfast, lunch, snacks, dinner };
    const plan = await WeeklyPlan.findOneAndUpdate(
      { userId: req.user._id, week },
      { $set: update },
      { upsert: true, new: true }
    );
    res.json({ status: 'success', day, plan: plan.plans[day] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
