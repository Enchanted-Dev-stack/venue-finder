const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
});

// Create compound index to efficiently query visits by user or venue
VisitSchema.index({ user: 1, venue: 1 });

module.exports = mongoose.model('Visit', VisitSchema); 