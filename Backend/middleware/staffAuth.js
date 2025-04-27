const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect staff routes
exports.protectStaff = async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

    // Check if token is for a staff member or owner
    if (decoded.role === 'staff') {
      // Get staff from the token
      req.staff = await Staff.findById(decoded.id);
      
      if (!req.staff) {
        return next(new ErrorResponse('Staff not found', 401));
      }

      if (!req.staff.isActive) {
        return next(new ErrorResponse('Staff account is inactive', 403));
      }
      
      // Add token data to request for permission checks
      req.user = null;
      req.permissions = req.staff.permissions;
      req.userType = 'staff';
      req.allowedVenues = req.staff.venues;
      
      // Update last login time
      await Staff.findByIdAndUpdate(decoded.id, { lastLogin: Date.now() });
    } else {
      // Get user from the token (owner)
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return next(new ErrorResponse('User not found', 401));
      }
      
      // Owners have all permissions
      req.staff = null;
      req.userType = 'owner';
      req.permissions = {
        canManageVenues: true,
        canManageBookings: true,
        canManageMenu: true,
        canManageOffers: true,
        canManagePackages: true,
        canManageStaff: true,
        canViewReports: true,
        canAcceptReservations: true
      };
      // Owners have access to all their venues (to be filtered in controllers)
    }

    next();
  } catch (err) {
    console.error('Staff auth middleware error:', err);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Check if user has required permission
exports.checkPermission = (permissionName) => {
  return (req, res, next) => {
    // Skip permission check for owners
    if (req.userType === 'owner') {
      return next();
    }
    
    // Check if staff has the required permission
    if (req.permissions && req.permissions[permissionName]) {
      return next();
    }
    
    return next(
      new ErrorResponse(
        `You do not have permission to perform this action`,
        403
      )
    );
  };
};

// Check if user has access to specific venue
exports.checkVenueAccess = () => {
  return (req, res, next) => {
    // Skip venue check for owners
    if (req.userType === 'owner') {
      return next();
    }
    
    const venueId = req.params.venueId || req.params.id || req.body.venue;
    
    // No venue ID specified - skip check
    if (!venueId) {
      return next();
    }
    
    // Check if staff has access to this venue
    if (req.allowedVenues && req.allowedVenues.some(id => id.toString() === venueId)) {
      return next();
    }
    
    return next(
      new ErrorResponse(
        `You do not have access to this venue`,
        403
      )
    );
  };
};

// Create audit trail for staff actions
exports.createAuditLog = (action) => {
  return (req, res, next) => {
    // Add audit info to request for controllers to log
    req.auditInfo = {
      action,
      performedBy: req.userType === 'staff' ? req.staff._id : req.user._id,
      performerType: req.userType,
      timestamp: Date.now()
    };
    
    next();
  };
};
