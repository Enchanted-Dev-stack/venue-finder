const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controllers
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
  getBookmarks,
  addBookmark,
  removeBookmark,
  getVisitedVenues,
  addVisit,
  removeVisit
} = require('../controllers/profile');

// Profile routes
router
  .route('/')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.put('/upload-image', protect, uploadProfileImage);
router.put('/change-password', protect, changePassword);

// Bookmark routes
router
  .route('/bookmarks')
  .get(protect, getBookmarks);

router
  .route('/bookmarks/:venueId')
  .post(protect, addBookmark)
  .delete(protect, removeBookmark);

// Visit routes
router
  .route('/visits')
  .get(protect, getVisitedVenues);

router
  .route('/visits/:venueId')
  .post(protect, addVisit)
  .delete(protect, removeVisit);

module.exports = router; 