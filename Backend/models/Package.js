const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  venue: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Venue',
    required: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  images: [String],
  featuredImage: String,
  price: {
    amount: { 
      type: Number, 
      required: true 
    },
    currency: {
      type: String,
      default: 'USD'
    },
    unit: { 
      type: String, 
      enum: ['hour', 'event', 'day', 'person'], 
      default: 'hour'
    }
  },
  capacity: {
    min: Number,
    max: Number
  },
  amenities: [String],
  packageType: {
    type: String,
    enum: ['privateRoom', 'eventSpace', 'partyArea', 'fullVenue', 'experience', 'other'],
    required: true
  },
  availability: {
    daysAvailable: [String], // Monday, Tuesday, etc.
    timeWindows: [{
      start: String, // HH:MM format
      end: String    // HH:MM format
    }]
  },
  advanceBookingRequired: {
    required: {
      type: Boolean,
      default: false
    },
    minHours: {
      type: Number,
      default: 24
    }
  },
  restrictions: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);
