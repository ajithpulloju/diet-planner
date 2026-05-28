const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, min: 10, max: 120 },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  height: { type: Number }, // cm
  weight: { type: Number }, // kg
  activity: { type: Number, default: 1.55 },
  goal: { type: String, enum: ['cut', 'maintain', 'recomp', 'bulk'], default: 'maintain' },
  stress: { type: Number, min: 1, max: 10, default: 5 },
  sleep: { type: String, default: 'good' },
  calorieGoal: { type: Number },
  bodyFat: { type: Number },
  bmi: { type: Number },
  targetWeight: { type: Number },
  streak: { type: Number, default: 1 },
  favorites: [{ type: Number }], // food IDs
  recent: [{ type: Number }],    // food IDs
  metricsHistory: [{
    date: String,
    weight: Number,
    bmi: Number,
    bodyFat: Number
  }],
  settings: {
    theme: { type: String, default: 'dark' },
    lang: { type: String, default: 'en' },
    notifMeals: { type: Boolean, default: true },
    notifGoals: { type: Boolean, default: true },
    notifWeekly: { type: Boolean, default: false }
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
