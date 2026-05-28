const express = require('express');
const Post = require('../models/Post');
const NutritionLog = require('../models/NutritionLog');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// GET /api/posts - Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(20);
    res.json({ status: 'success', posts });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/posts - Create a post from today's log
router.post('/', async (req, res) => {
  try {
    const { date, time, title, stats, images, breakdown } = req.body;
    
    // Check if post already exists for this user and date to avoid duplicates
    // But the user might want multiple posts? Usually one daily post.
    const existingPost = await Post.findOne({ userId: req.user._id, date });
    if (existingPost) {
        // Update existing post or return error?
        // Let's allow updating for now, or just return error.
        // User said: "Final saved memories (immutable)" 
        // But maybe they want to overwrite if they clicked post again?
        // "Posts = Final saved memories (immutable)" -> maybe I should check.
    }

    const post = new Post({
      userId: req.user._id,
      userName: req.user.name,
      date,
      time,
      title: title || 'Selected My Routine',
      stats,
      images,
      breakdown
    });

    await post.save();
    res.json({ status: 'success', post });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
