const Staff = require('../models/Staff');
const User = require('../models/User');
const Venue = require('../models/Venue');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private (Owner only)
exports.getStaff = asyncHandler(async (req, res, next) => {
  // Get staff members owned by current user
  const staff = await Staff.find({ owner: req.user.id })
    .populate('venues', 'name address')
    .sort('lastName firstName');

  res.status(200).json({
    success: true,
    count: staff.length,
    data: staff
  });
});

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private (Owner only)
exports.getStaffMember = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id).populate('venues', 'name address');

  if (!staff) {
    return next(new ErrorResponse(`Staff member not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is staff owner
  if (staff.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this staff member`, 401));
  }

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Create new staff member
// @route   POST /api/staff
// @access  Private (Owner only)
exports.createStaffMember = asyncHandler(async (req, res, next) => {
  // Add owner to req.body
  req.body.owner = req.user.id;

  // Create staff member
  const staff = await Staff.create(req.body);

  res.status(201).json({
    success: true,
    data: staff
  });
});

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private (Owner only)
exports.updateStaffMember = asyncHandler(async (req, res, next) => {
  let staff = await Staff.findById(req.params.id);

  if (!staff) {
    return next(new ErrorResponse(`Staff member not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is staff owner
  if (staff.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this staff member`, 401));
  }

  // Check if password is being updated
  if (req.body.password) {
    // Use the staff model instance to ensure password gets hashed via middleware
    staff.password = req.body.password;
    delete req.body.password; // Remove password from req.body as we're handling it separately
  }

  // Update all other fields
  Object.keys(req.body).forEach(key => {
    staff[key] = req.body[key];
  });

  // Save the document to trigger the pre-save middleware
  await staff.save();

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private (Owner only)
exports.deleteStaffMember = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    return next(new ErrorResponse(`Staff member not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is staff owner
  if (staff.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this staff member`, 401));
  }

  await staff.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Assign venue to staff member
// @route   POST /api/staff/:id/venues/:venueId
// @access  Private (Owner only)
exports.assignVenue = asyncHandler(async (req, res, next) => {
  const staffId = req.params.id;
  const venueId = req.params.venueId;

  // Check if staff exists
  const staff = await Staff.findById(staffId);
  if (!staff) {
    return next(new ErrorResponse(`Staff member not found with id of ${staffId}`, 404));
  }

  // Make sure user is staff owner
  if (staff.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this staff member`, 401));
  }

  // Check if venue exists and belongs to user
  const venue = await Venue.findById(venueId);
  if (!venue) {
    return next(new ErrorResponse(`Venue not found with id of ${venueId}`, 404));
  }

  if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to assign this venue`, 401));
  }

  // Check if venue is already assigned
  if (staff.venues.includes(venueId)) {
    return next(new ErrorResponse(`Venue ${venueId} is already assigned to this staff member`, 400));
  }

  // Add venue to staff
  staff.venues.push(venueId);
  await staff.save();

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Revoke venue from staff member
// @route   DELETE /api/staff/:id/venues/:venueId
// @access  Private (Owner only)
exports.revokeVenue = asyncHandler(async (req, res, next) => {
  const staffId = req.params.id;
  const venueId = req.params.venueId;

  // Check if staff exists
  const staff = await Staff.findById(staffId);
  if (!staff) {
    return next(new ErrorResponse(`Staff member not found with id of ${staffId}`, 404));
  }

  // Make sure user is staff owner
  if (staff.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this staff member`, 401));
  }

  // Check if venue is assigned
  if (!staff.venues.includes(venueId)) {
    return next(new ErrorResponse(`Venue ${venueId} is not assigned to this staff member`, 400));
  }

  // Remove venue from staff
  staff.venues = staff.venues.filter(v => v.toString() !== venueId);
  await staff.save();

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Get current staff profile
// @route   GET /api/staff/me
// @access  Private (Staff only)
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.staff.id).populate('venues', 'name address category');

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Update current staff profile
// @route   PUT /api/staff/me
// @access  Private (Staff only)
exports.updateMyProfile = asyncHandler(async (req, res, next) => {
  // Only allow specific fields to be updated
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    profileImage: req.body.profileImage
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => {
    if (fieldsToUpdate[key] === undefined) {
      delete fieldsToUpdate[key];
    }
  });

  const staff = await Staff.findByIdAndUpdate(req.staff.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Create audit log for staff action
// @route   Internal use only
// @access  Private
exports.createAuditLog = asyncHandler(async (req, res, next) => {
  // Implementation will depend on your audit log schema/model
  // This is just a placeholder
  console.log(`Audit: Staff ${req.staff.id} performed action: ${req.body.action} on ${req.body.resource}`);
  
  // Continue to the next middleware/controller
  next();
});
