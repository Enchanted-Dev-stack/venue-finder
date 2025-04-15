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
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1']
  },
  socialLinks: {
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    }
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'restaurant',
      'cafe',
      'bar',
      'pub',
      'club',
      'event_space',
      'hotel',
      'concert_hall',
      'theater',
      'sports_venue',
      'conference_center',
      'banquet_hall',
      'other'
    ]
  },
  amenities: {
    type: [String],
    default: []
  },
  eventTypes: {
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
  cateringOptions: {
    type: String,
    enum: ['in_house', 'preferred_vendors', 'external'],
    default: 'in_house'
  },
  pricing: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    required: [true, 'Please select a price range']
  },
  menus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }],
  pricingMenu: {
    type: [{
      name: String,
      description: String,
      price: Number,
      category: String,
      isPopular: Boolean
    }],
    default: [],
    deprecated: true
  },
  packages: {
    type: [{
      name: String,
      description: String,
      features: [String],
      price: Number,
      duration: String,
      isPopular: Boolean
    }],
    default: [],
    deprecated: true
  },
  media: {
    images: {
      type: [String],
      default: ['default-venue.jpg']
    },
    hasPromoVideo: {
      type: Boolean,
      default: false
    },
    promoVideoUrl: {
      type: String
    },
    has360Tour: {
      type: Boolean,
      default: false
    },
    tour360Url: {
      type: String
    }
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
  theme: {
    type: String,
    enum: ['default', 'modern', 'classic', 'elegant', 'vibrant'],
    default: 'default'
  },
  customFields: [
    {
      name: String,
      value: mongoose.Schema.Types.Mixed
    }
  ],
  acceptingBookings: {
    type: Boolean,
    default: true
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Cascade delete reviews and menus when a venue is deleted
VenueSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ venue: this._id });
  await this.model('Menu').deleteMany({ venue: this._id });
  next();
});

// Reverse populate with reviews
VenueSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'venue',
  justOne: false
});

// Virtual for getting the default menu
VenueSchema.virtual('defaultMenu', {
  ref: 'Menu',
  localField: '_id',
  foreignField: 'venue',
  justOne: true,
  options: { match: { isDefault: true } }
});

module.exports = mongoose.model('Venue', VenueSchema); 