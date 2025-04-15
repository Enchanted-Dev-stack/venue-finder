const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Menu = require('../models/Menu');

// Import controllers
const {
  getMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getVenueMenus
} = require('../controllers/menus');

// Routes with venue ID will come through the venues router
// /api/venues/:venueId/menus
router
  .route('/')
  .get(
    advancedResults(Menu, {
      path: 'venue',
      select: 'name description location'
    }),
    getMenus
  )
  .post(protect, authorize('owner', 'admin'), createMenu);

router
  .route('/:id')
  .get(getMenu)
  .put(protect, authorize('owner', 'admin'), updateMenu)
  .delete(protect, authorize('owner', 'admin'), deleteMenu);

// Routes for menu items within categories
router
  .route('/:id/categories/:categoryId/items')
  .post(protect, authorize('publisher', 'admin'), addMenuItem);

router
  .route('/:id/categories/:categoryId/items/:itemId')
  .put(protect, authorize('publisher', 'admin'), updateMenuItem)
  .delete(protect, authorize('publisher', 'admin'), deleteMenuItem);

// Get all menus for a specific venue
router.route('/venue/:venueId').get(getVenueMenus);

// Export router
module.exports = router; 