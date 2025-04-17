const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const checkOwnership = require('../middleware/checkOwnership');

// Import controllers
const {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenuesInRadius,
  uploadVenuePhoto,
  uploadPromoVideo,
  upload360Tour,
  submitVenueForm
} = require('../controllers/venues');

// Include review router
const reviewRouter = require('./reviews');
// Include offers router
const offersRouter = require('./offers');
// Include menus router
const menusRouter = require('./menus');

// Re-route into other resource routers
router.use('/:venueId/reviews', reviewRouter);
// Re-route venue offers
router.use('/:venueId/offers', offersRouter);
// Re-route venue menus
router.use('/:venueId/menus', menusRouter);

// Middleware to conditionally apply authentication
const conditionalProtect = (req, res, next) => {
  // If requesting user's own venues, require authentication
  if (req.query.owner === 'current') {
    return protect(req, res, next);
  }
  // Otherwise proceed without authentication
  next();
};

router
  .route('/')
  .get(conditionalProtect, getVenues)
  .post(protect, createVenue);

// New route for comprehensive venue form submission
router
  .route('/submit-form')
  .post(protect, submitVenueForm);

router
  .route('/:id')
  .get(getVenue)
  .put(protect, checkOwnership('Venue'), updateVenue)
  .delete(protect, checkOwnership('Venue'), authorize('admin'), deleteVenue);

router
  .route('/radius/:lat/:lng/:distance')
  .get(getVenuesInRadius);

router
  .route('/:id/photo')
  .put(protect, checkOwnership('Venue'), uploadVenuePhoto);

router
  .route('/:id/promo-video')
  .put(protect, checkOwnership('Venue'), uploadPromoVideo);

router
  .route('/:id/tour360')
  .put(protect, checkOwnership('Venue'), upload360Tour);

module.exports = router; 