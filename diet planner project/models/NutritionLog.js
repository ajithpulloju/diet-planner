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
  dinner: [foodItemSchema]
}, { timestamps: true });

nutritionLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('NutritionLog', nutritionLogSchema);
