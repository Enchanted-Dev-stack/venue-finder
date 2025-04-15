const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Import controllers
const {
  getOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
  getVenueOffers
} = require('../controllers/offers');

// Custom middleware for optional authentication
const optionalAuth = (req, res, next) => {
  // Try to authenticate, but proceed even if no token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      
      // Set user if token is valid
      User.findById(decoded.id)
        .then(user => {
          req.user = user;
          next();
        })
        .catch(err => {
          // Just proceed without user if error
          next();
        });
    } catch (err) {
      // If token is invalid, just proceed without authentication
      next();
    }
  } else {
    // No token, just proceed
    next();
  }
};

// Routes
router
  .route('/')
  .get(optionalAuth, getOffers)
  .post(protect, createOffer);

router
  .route('/:id')
  .get(optionalAuth, getOffer)
  .put(protect, updateOffer)
  .delete(protect, deleteOffer);

module.exports = router; 