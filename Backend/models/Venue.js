const mongoose = require('mongoose');
// Remove geocoder dependency
// const geocoder = require('../utils/geocoder');

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      required: [true, 'Please add coordinates (longitude, latitude)']
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  website: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Restaurant',
      'Café',
      'Bar',
      'Pub',
      'Club',
      'Event Space',
      'Hotel',
      'Concert Hall',
      'Theater',
      'Sports Venue',
      'Conference Center',
      'Other'
    ]
  },
  amenities: {
    type: [String],
    default: []
  },
  pricing: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    required: [true, 'Please select a price range']
  },
  operatingHours: {
    monday: {
      open: String,
      close: String,
      isClosed: {
        type: Boolean,
        default: false
      }
    },
    tuesday: {
      open: String,
      close: String,
      isClosed: {
        type: Boolean,
        default: false
      }
    },
    wednesday: {
      open: String,
      close: String,
      isClosed: {
        type: Boolean,
        default: false
      }
    },
    thursday: {
      open: String,
      close: String,
      isClosed: {
        type: Boolean,
        default: false
      }
    },
    friday: {
      open: String,
      close: String,
      isClosed: {
        type: Boolean,
        default: false
      }
    },
    saturday: {
      open: String,
      close: String,
      isClosed: {
        type: Boolean,
        default: false
      }
    },
    sunday: {
      open: String,
      close: String,
      isClosed: {
        type: Boolean,
        default: false
      }
    }
  },
  photos: {
    type: [String],
    default: ['default-venue.jpg']
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Remove geocoding middleware and use client-side geocoding
// VenueSchema.pre('save', async function(next) {
//   // Only run this function if address was modified
//   if (!this.isModified('address')) {
//     return next();
//   }
//   
//   try {
//     // We'll need to implement or install a geocoder
//     // For now, just leaving a placeholder
//     // const loc = await geocoder.geocode(this.address);
//     // this.location = {
//     //   type: 'Point',
//     //   coordinates: [loc[0].longitude, loc[0].latitude],
//     //   formattedAddress: loc[0].formattedAddress,
//     //   street: loc[0].streetName,
//     //   city: loc[0].city,
//     //   state: loc[0].stateCode,
//     //   zipcode: loc[0].zipcode,
//     //   country: loc[0].countryCode
//     // };
//     
//     // Don't save address in DB
//     // this.address = undefined;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// Cascade delete reviews when a venue is deleted
VenueSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ venue: this._id });
  next();
});

// Reverse populate with reviews
VenueSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'venue',
  justOne: false
});

module.exports = mongoose.model('Venue', VenueSchema); 