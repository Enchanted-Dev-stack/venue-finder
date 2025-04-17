const mongoose = require('mongoose');

// Schema for individual menu items
const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for the menu item'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price for the menu item']
  },
  image: {
    type: String
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['starter', 'main', 'dessert', 'beverage', 'side', 'special']
  },
  tags: {
    type: [String],
    default: []
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spicyLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  popular: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for menu categories
const MenuCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    maxlength: [100, 'Category name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  items: [MenuItemSchema],
  order: {
    type: Number,
    default: 0
  }
});

// Main Menu Schema
const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a menu name'],
    trim: true,
    maxlength: [200, 'Menu name cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify menu type'],
    enum: ['regular', 'special', 'seasonal', 'lunch', 'dinner', 'breakfast']
  },
  categories: [MenuCategorySchema],
  venue: {
    type: mongoose.Schema.ObjectId,
    ref: 'Venue',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  // For packages/special offers
  packages: [
    {
      name: {
        type: String,
        required: [true, 'Please provide a package name'],
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      price: {
        type: Number,
        required: [true, 'Please add a price'],
      },
      items: [
        {
          item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
          },
          quantity: {
            type: Number,
            default: 1
          }
        }
      ],
      isPopular: {
        type: Boolean,
        default: false
      },
      discount: {
        type: Number,
        default: 0
      },
      minGuests: {
        type: Number,
        default: 1
      },
      maxGuests: {
        type: Number
      },
      duration: String
    }
  ],
  availabilitySchedule: {
    monday: { isAvailable: { type: Boolean, default: true } },
    tuesday: { isAvailable: { type: Boolean, default: true } },
    wednesday: { isAvailable: { type: Boolean, default: true } },
    thursday: { isAvailable: { type: Boolean, default: true } },
    friday: { isAvailable: { type: Boolean, default: true } },
    saturday: { isAvailable: { type: Boolean, default: true } },
    sunday: { isAvailable: { type: Boolean, default: true } }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent venue from having more than one default menu
MenuSchema.pre('save', async function(next) {
  if (this.isDefault) {
    // Find other default menus for this venue and unset them
    await this.constructor.updateMany(
      { venue: this.venue, _id: { $ne: this._id }, isDefault: true },
      { isDefault: false }
    );
  }
  this.updatedAt = Date.now();
  next();
});

// Create indexes for improved query performance
MenuSchema.index({ venue: 1 });

module.exports = mongoose.model('Menu', MenuSchema); 