const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:mm
  title: { type: String, default: 'Selected My Routine' },
  stats: {
    totalProtein: Number,
    mealTimes: {
      breakfast: String,
      lunch: String,
      preworkout: String,
      dinner: String,
      midnight: String
    },
    records: [String] // e.g. "Protein improvement vs yesterday: +10g"
  },
  images: {
    breakfast: String, // Base64 or URL
    lunch: String,
    preworkout: String,
    dinner: String,
    midnight: String
  },
  breakdown: {
    breakfast: Number,
    lunch: Number,
    preworkout: Number,
    dinner: Number,
    midnight: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
