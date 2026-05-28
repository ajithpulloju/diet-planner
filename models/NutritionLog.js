const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  foodId: Number,
  name: String,
  em: String,
  cal: Number,
  p: Number,
  c: Number,
  f: Number,
  fi: Number,
  serving: Number
}, { _id: false });

const nutritionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  breakfast: [foodItemSchema],
  lunch: [foodItemSchema],
  snacks: [foodItemSchema],
  preworkout: [foodItemSchema],
  dinner: [foodItemSchema],
  midnight: [foodItemSchema],
  images: {
    breakfast: String,
    lunch: String,
    preworkout: String,
    dinner: String,
    midnight: String
  },
  timings: {
    breakfast: String,
    lunch: String,
    preworkout: String,
    dinner: String,
    midnight: String
  }
}, { timestamps: true });

nutritionLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('NutritionLog', nutritionLogSchema);
