const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  venue: {
    type: mongoose.Schema.ObjectId,
    ref: 'Venue',
    required: [true, 'Offer must be associated with a venue']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'package'],
    required: [true, 'Please specify the discount type']
  },
  discountValue: {
    type: Number,
    required: [true, 'Please specify the discount value'],
    min: [0, 'Discount value cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  limitedAvailability: {
    type: Boolean,
    default: false
  },
  availableSlots: {
    type: Number,
    min: [0, 'Available slots cannot be negative']
  },
  termsAndConditions: {
    type: String,
    trim: true
  },
  promoCode: {
    type: String,
    trim: true
  },
  applicableEventTypes: {
    type: [String],
    enum: [
      'wedding',
      'corporate',
      'birthday',
      'conference',
      'exhibition',
      'party',
      'meeting',
      'workshop',
      'seminar',
      'celebration',
      'other'
    ],
    default: []
  },
  minimumBookingAmount: {
    type: Number,
    min: [0, 'Minimum booking amount cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Offer must have an owner']
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for improved query performance
OfferSchema.index({ venue: 1 });
OfferSchema.index({ startDate: 1, endDate: 1 });
OfferSchema.index({ isActive: 1 });

// Custom method to check if offer is valid (current date is between start and end dates)
OfferSchema.methods.isValid = function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate && this.isActive;
};

module.exports = mongoose.model('Offer', OfferSchema); 