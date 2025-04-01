const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add some content'],
    trim: true,
    maxlength: [1000, 'Review content cannot be more than 1000 characters']
  },
  photos: {
    type: [String],
    default: []
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userImage: {
    type: String
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent user from submitting more than one review per venue
ReviewSchema.index({ venue: 1, user: 1 }, { unique: true });

// Calculate average rating of venue
ReviewSchema.statics.getAverageRating = async function(venueId) {
  const obj = await this.aggregate([
    {
      $match: { venue: venueId }
    },
    {
      $group: {
        _id: '$venue',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj[0]) {
      await this.model('Venue').findByIdAndUpdate(venueId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: obj[0].reviewCount
      });
    } else {
      await this.model('Venue').findByIdAndUpdate(venueId, {
        averageRating: undefined,
        reviewCount: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.venue);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.venue);
});

module.exports = mongoose.model('Review', ReviewSchema); 