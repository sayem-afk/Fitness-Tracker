const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$'],
    default: '$$'
  },
  amenities: [{
    type: String
  }],
  hours: {
    weekday: { type: String, default: '6:00 AM - 10:00 PM' },
    weekend: { type: String, default: '7:00 AM - 9:00 PM' }
  },
  membershipTypes: [{
    name: String,
    price: Number,
    duration: String
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gym', GymSchema);
