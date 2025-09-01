const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Strength', 'Cardio', 'Flexibility'],
    required: true
  },
  caloriesPerMinute: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  description: {
    type: String,
    required: true
  },
  instructions: [{
    type: String
  }],
  videoUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', ExerciseSchema);