const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers
const {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenuesInRadius,
  uploadVenuePhoto
} = require('../controllers/venues');

// Include review router
const reviewRouter = require('./reviews');

// Re-route into other resource routers
router.use('/:venueId/reviews', reviewRouter);

router
  .route('/')
  .get(getVenues)
  .post(protect, createVenue);

router
  .route('/:id')
  .get(getVenue)
  .put(protect, updateVenue)
  .delete(protect, authorize('admin'), deleteVenue);

router
  .route('/radius/:lat/:lng/:distance')
  .get(getVenuesInRadius);

router
  .route('/:id/photo')
  .put(protect, uploadVenuePhoto);

module.exports = router; 