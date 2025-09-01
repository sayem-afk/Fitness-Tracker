const mongoose = require('mongoose');

const TutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Strength', 'Cardio', 'Flexibility', 'Nutrition'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  equipment: [{
    type: String
  }],
  steps: [{
    step: Number,
    instruction: String,
    duration: Number
  }],
  videoUrl: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tutorial', TutorialSchema);
