const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Menu = require('../models/Menu');
const Venue = require('../models/Venue');

// @desc    Get all menus
// @route   GET /api/v1/menus
// @access  Public
exports.getMenus = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single menu
// @route   GET /api/v1/menus/:id
// @access  Public
exports.getMenu = asyncHandler(async (req, res, next) => {
  const menu = await Menu.findById(req.params.id);

  if (!menu) {
    return next(
      new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: menu
  });
});

// @desc    Create new menu
// @route   POST /api/v1/menus
// @access  Private
exports.createMenu = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for venue ownership if venue is provided
  if (req.body.venue) {
    const venue = await Venue.findById(req.body.venue);

    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.body.venue}`, 404)
      );
    }

    // Make sure user is venue owner
    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to add a menu to venue ${venue._id}`,
          401
        )
      );
    }
  }

  const menu = await Menu.create(req.body);

  res.status(201).json({
    success: true,
    data: menu
  });
});

// @desc    Update menu
// @route   PUT /api/v1/menus/:id
// @access  Private
exports.updateMenu = asyncHandler(async (req, res, next) => {
  let menu = await Menu.findById(req.params.id);

  if (!menu) {
    return next(
      new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is menu owner or admin
  if (menu.user && menu.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this menu`,
        401
      )
    );
  }

  menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: menu
  });
});

// @desc    Delete menu
// @route   DELETE /api/v1/menus/:id
// @access  Private
exports.deleteMenu = asyncHandler(async (req, res, next) => {
  const menu = await Menu.findById(req.params.id);

  if (!menu) {
    return next(
      new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is menu owner or admin
  if (menu.user && menu.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this menu`,
        401
      )
    );
  }

  await menu.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get menus for venue
// @route   GET /api/v1/venues/:venueId/menus
// @access  Public
exports.getVenueMenus = asyncHandler(async (req, res, next) => {
  const menus = await Menu.find({ venue: req.params.venueId });

  if (!menus) {
    return next(
      new ErrorResponse(`No menus found for venue ${req.params.venueId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    count: menus.length,
    data: menus
  });
});

// @desc    Add menu item to category
// @route   POST /api/menus/:id/categories/:categoryId/items
// @access  Private
exports.addMenuItem = asyncHandler(async (req, res, next) => {
  let menu = await Menu.findById(req.params.id);

  if (!menu) {
    return next(
      new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404)
    );
  }

  // Find the venue to check ownership
  const venue = await Venue.findById(menu.venue);

  // Make sure user is venue owner or admin
  if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this menu`, 401)
    );
  }

  // Find the category
  const categoryIndex = menu.categories.findIndex(
    cat => cat._id.toString() === req.params.categoryId
  );

  if (categoryIndex === -1) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.categoryId}`, 404)
    );
  }

  // Add item to category
  menu.categories[categoryIndex].items.push(req.body);
  await menu.save();

  res.status(200).json({
    success: true,
    data: menu
  });
});

// @desc    Update menu item
// @route   PUT /api/menus/:id/categories/:categoryId/items/:itemId
// @access  Private
exports.updateMenuItem = asyncHandler(async (req, res, next) => {
  let menu = await Menu.findById(req.params.id);

  if (!menu) {
    return next(
      new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404)
    );
  }

  // Find the venue to check ownership
  const venue = await Venue.findById(menu.venue);

  // Make sure user is venue owner or admin
  if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this menu`, 401)
    );
  }

  // Find the category
  const categoryIndex = menu.categories.findIndex(
    cat => cat._id.toString() === req.params.categoryId
  );

  if (categoryIndex === -1) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.categoryId}`, 404)
    );
  }

  // Find the item
  const itemIndex = menu.categories[categoryIndex].items.findIndex(
    item => item._id.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.itemId}`, 404)
    );
  }

  // Update item
  menu.categories[categoryIndex].items[itemIndex] = {
    ...menu.categories[categoryIndex].items[itemIndex],
    ...req.body
  };

  await menu.save();

  res.status(200).json({
    success: true,
    data: menu
  });
});

// @desc    Delete menu item
// @route   DELETE /api/menus/:id/categories/:categoryId/items/:itemId
// @access  Private
exports.deleteMenuItem = asyncHandler(async (req, res, next) => {
  let menu = await Menu.findById(req.params.id);

  if (!menu) {
    return next(
      new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404)
    );
  }

  // Find the venue to check ownership
  const venue = await Venue.findById(menu.venue);

  // Make sure user is venue owner or admin
  if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this menu`, 401)
    );
  }

  // Find the category
  const categoryIndex = menu.categories.findIndex(
    cat => cat._id.toString() === req.params.categoryId
  );

  if (categoryIndex === -1) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.categoryId}`, 404)
    );
  }

  // Remove the item
  menu.categories[categoryIndex].items = menu.categories[categoryIndex].items.filter(
    item => item._id.toString() !== req.params.itemId
  );

  await menu.save();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 