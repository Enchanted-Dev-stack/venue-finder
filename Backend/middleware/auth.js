const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  console.log('[auth.js] Authenticating request to:', req.originalUrl);

  // Check for Authorization header with Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('[auth.js] Bearer token found in Authorization header');
  } else {
    console.log('[auth.js] No Authorization header or Bearer token found');
  }

  // Make sure token exists
  if (!token) {
    console.log('[auth.js] Authentication failed: No token provided');
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    console.log('[auth.js] Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    console.log('[auth.js] Token decoded successfully, user id:', decoded.id);

    // Get user from the token
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      console.log('[auth.js] Authentication failed: User not found for token');
      return next(new ErrorResponse('User not found', 401));
    }
    
    console.log(`[auth.js] Authentication successful for user: ${req.user._id}, ${req.user.email}`);
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      console.error('[auth.js] Invalid token:', err.message);
    } else if (err.name === 'TokenExpiredError') {
      console.error('[auth.js] Token expired:', err.message);
    } else {
      console.error('[auth.js] Auth middleware error:', err);
    }
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
}; 