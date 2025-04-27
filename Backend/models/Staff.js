const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const StaffSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries
  },
  phone: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: 'default-staff.jpg'
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'host', 'booking_agent', 'menu_manager'],
    default: 'host'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  }],
  permissions: {
    canManageVenues: {
      type: Boolean,
      default: false
    },
    canManageStaff: {
      type: Boolean,
      default: false
    },
    canManageBookings: {
      type: Boolean,
      default: false
    },
    canManageMenu: {
      type: Boolean,
      default: false
    },
    canManageOffers: {
      type: Boolean,
      default: false
    },
    canManagePackages: {
      type: Boolean,
      default: false
    },
    canViewReports: {
      type: Boolean,
      default: false
    },
    canAcceptReservations: {
      type: Boolean,
      default: false
    }
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create virtual for full name
StaffSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Generate JWT
StaffSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      permissions: this.permissions,
      venues: this.venues
    },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Match staff entered password to hashed password in database
StaffSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving to database
StaffSchema.pre('save', async function(next) {
  // Only hash the password if it's been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Set default permissions based on role
StaffSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('role')) {
    // Set default permissions based on role
    switch (this.role) {
      case 'admin':
        this.permissions = {
          canManageVenues: true,
          canManageBookings: true,
          canManageMenu: true,
          canManageOffers: true,
          canManagePackages: true,
          canManageStaff: true,
          canViewReports: true,
          canAcceptReservations: true
        };
        break;
      case 'manager':
        this.permissions = {
          canManageVenues: true,
          canManageBookings: true,
          canManageMenu: true,
          canManageOffers: true,
          canManagePackages: true,
          canManageStaff: false,
          canViewReports: true,
          canAcceptReservations: true
        };
        break;
      case 'booking_agent':
        this.permissions = {
          canManageVenues: false,
          canManageBookings: true,
          canManageMenu: false,
          canManageOffers: false,
          canManagePackages: false,
          canManageStaff: false,
          canViewReports: false,
          canAcceptReservations: true
        };
        break;
      case 'menu_manager':
        this.permissions = {
          canManageVenues: false,
          canManageBookings: false,
          canManageMenu: true,
          canManageOffers: true,
          canManagePackages: true,
          canManageStaff: false,
          canViewReports: false,
          canAcceptReservations: false
        };
        break;
      default: // host
        this.permissions = {
          canManageVenues: false,
          canManageBookings: false,
          canManageMenu: false,
          canManageOffers: false,
          canManagePackages: false,
          canManageStaff: false,
          canViewReports: false,
          canAcceptReservations: true
        };
    }
  }
  next();
});

module.exports = mongoose.model('Staff', StaffSchema);
