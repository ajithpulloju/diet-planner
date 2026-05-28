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

const weeklyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  week: { type: String, required: true }, // ISO week string e.g. "2026-W13"
  plans: {
    mon: { breakfast: [foodItemSchema], lunch: [foodItemSchema], snacks: [foodItemSchema], dinner: [foodItemSchema] },
    tue: { breakfast: [foodItemSchema], lunch: [foodItemSchema], snacks: [foodItemSchema], dinner: [foodItemSchema] },
    wed: { breakfast: [foodItemSchema], lunch: [foodItemSchema], snacks: [foodItemSchema], dinner: [foodItemSchema] },
    thu: { breakfast: [foodItemSchema], lunch: [foodItemSchema], snacks: [foodItemSchema], dinner: [foodItemSchema] },
    fri: { breakfast: [foodItemSchema], lunch: [foodItemSchema], snacks: [foodItemSchema], dinner: [foodItemSchema] },
    sat: { breakfast: [foodItemSchema], lunch: [foodItemSchema], snacks: [foodItemSchema], dinner: [foodItemSchema] },
    sun: { breakfast: [foodItemSchema], lunch: [foodItemSchema], snacks: [foodItemSchema], dinner: [foodItemSchema] }
  }
}, { timestamps: true });

weeklyPlanSchema.index({ userId: 1, week: 1 }, { unique: true });

module.exports = mongoose.model('WeeklyPlan', weeklyPlanSchema);
