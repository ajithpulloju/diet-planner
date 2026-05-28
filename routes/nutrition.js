const express = require('express');
const NutritionLog = require('../models/NutritionLog');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// GET /api/nutrition/log/:date
router.get('/log/:date', async (req, res) => {
  try {
    let log = await NutritionLog.findOne({ userId: req.user._id, date: req.params.date });
    if (!log) log = { breakfast: [], lunch: [], snacks: [], preworkout: [], dinner: [], midnight: [], images: {}, timings: {} };
    res.json({ status: 'success', log });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/nutrition/log/:date  (upsert full day log)
router.put('/log/:date', async (req, res) => {
  try {
    const { breakfast, lunch, snacks, preworkout, dinner, midnight, images, timings } = req.body;
    const log = await NutritionLog.findOneAndUpdate(
      { userId: req.user._id, date: req.params.date },
      { 
        breakfast: breakfast || [], 
        lunch: lunch || [], 
        snacks: snacks || [], 
        preworkout: preworkout || [],
        dinner: dinner || [], 
        midnight: midnight || [],
        images: images || {},
        timings: timings || {}
      },
      { upsert: true, new: true }
    );
    res.json({ status: 'success', log });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/nutrition/log/:date/:slot/image (upload image for slot)
router.post('/log/:date/:slot/image', async (req, res) => {
  try {
    const { date, slot } = req.params;
    const { image } = req.body; // Base64
    let log = await NutritionLog.findOne({ userId: req.user._id, date });
    if (!log) log = new NutritionLog({ userId: req.user._id, date });
    if (!log.images) log.images = {};
    log.images[slot] = image;
    await log.save();
    res.json({ status: 'success', log });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/nutrition/log/:date/:slot/time (set time for slot)
router.post('/log/:date/:slot/time', async (req, res) => {
  try {
    const { date, slot } = req.params;
    const { time } = req.body;
    let log = await NutritionLog.findOne({ userId: req.user._id, date });
    if (!log) log = new NutritionLog({ userId: req.user._id, date });
    if (!log.timings) log.timings = {};
    log.timings[slot] = time;
    await log.save();
    res.json({ status: 'success', log });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/nutrition/log/:date/:slot  (add food item to slot)
router.post('/log/:date/:slot', async (req, res) => {
  try {
    const { date, slot } = req.params;
    const validSlots = ['breakfast', 'lunch', 'snacks', 'preworkout', 'dinner', 'midnight'];
    if (!validSlots.includes(slot)) return res.status(400).json({ status: 'error', message: 'Invalid slot' });
    let log = await NutritionLog.findOne({ userId: req.user._id, date });
    if (!log) log = new NutritionLog({ userId: req.user._id, date, breakfast: [], lunch: [], snacks: [], preworkout: [], dinner: [], midnight: [] });
    log[slot].push(req.body);
    await log.save();
    res.json({ status: 'success', log });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/nutrition/week  (last 7 days logs)
router.get('/week', async (req, res) => {
  try {
    const logs = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const log = await NutritionLog.findOne({ userId: req.user._id, date: ds });
      logs[ds] = log || { breakfast: [], lunch: [], snacks: [], preworkout: [], dinner: [], midnight: [], images: {}, timings: {} };
    }
    res.json({ status: 'success', logs });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
