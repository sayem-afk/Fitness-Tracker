const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Strength', 'Cardio', 'Flexibility'],
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    caloriesBurned: {
      type: Number,
      required: true
    }
  }],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
WorkoutSchema.pre('save', function(next) {
  this.totalCalories = this.exercises.reduce((total, ex) => total + ex.caloriesBurned, 0);
  this.totalDuration = this.exercises.reduce((total, ex) => total + ex.duration, 0);
  next();
});

module.exports = mongoose.model('Workout', WorkoutSchema);