const User = require('../models/User');
const Venue = require('../models/Venue');
const Visit = require('../models/Visit');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const bcrypt = require('bcryptjs');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    // Remove fields that shouldn't be updated via this route
    const { password, role, email, ...updateData } = req.body;
    
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload profile image
// @route   PUT /api/profile/upload-image
// @access  Private
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.files) {
      return next(new ErrorResponse('Please upload a file', 400));
    }
    
    const file = req.files.file;
    
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }
    
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
    
    // Create custom filename
    file.name = `profile_${req.user.id}${path.parse(file.name).ext}`;
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/profiles/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse('Problem with file upload', 500));
      }
      
      await User.findByIdAndUpdate(req.user.id, { profileImage: file.name });
      
      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change password
// @route   PUT /api/profile/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return next(new ErrorResponse('Please provide current and new password', 400));
    }
    
    // Check current password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!(await user.matchPassword(currentPassword))) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bookmarked venues
// @route   GET /api/profile/bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    
    res.status(200).json({
      success: true,
      count: user.bookmarks.length,
      data: user.bookmarks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add bookmark
// @route   POST /api/profile/bookmarks/:venueId
// @access  Private
exports.addBookmark = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.venueId);
    
    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.venueId}`, 404)
      );
    }
    
    // Check if already bookmarked
    const user = await User.findById(req.user.id);
    
    if (user.bookmarks.includes(req.params.venueId)) {
      return next(
        new ErrorResponse('Venue already bookmarked', 400)
      );
    }
    
    // Add to bookmarks
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { bookmarks: req.params.venueId }
    });
    
    res.status(200).json({
      success: true,
      message: 'Venue bookmarked'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/profile/bookmarks/:venueId
// @access  Private
exports.removeBookmark = async (req, res, next) => {
  try {
    // Check if venue exists
    const venue = await Venue.findById(req.params.venueId);
    
    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.venueId}`, 404)
      );
    }
    
    // Remove from bookmarks
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { bookmarks: req.params.venueId }
    });
    
    res.status(200).json({
      success: true,
      message: 'Bookmark removed'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get visited venues
// @route   GET /api/profile/visits
// @access  Private
exports.getVisitedVenues = async (req, res, next) => {
  try {
    const visits = await Visit.find({ user: req.user.id }).populate('venue');
    
    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add visit
// @route   POST /api/profile/visits/:venueId
// @access  Private
exports.addVisit = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.venueId);
    
    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.venueId}`, 404)
      );
    }
    
    // Add to visited venues
    const visit = await Visit.create({
      user: req.user.id,
      venue: req.params.venueId,
      notes: req.body.notes
    });
    
    // Also add to visited array in user model for quick access
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { visited: req.params.venueId }
    });
    
    res.status(201).json({
      success: true,
      data: visit
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove visit
// @route   DELETE /api/profile/visits/:venueId
// @access  Private
exports.removeVisit = async (req, res, next) => {
  try {
    // Delete visit record
    await Visit.findOneAndDelete({
      user: req.user.id,
      venue: req.params.venueId
    });
    
    // Remove from visited array in user model
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { visited: req.params.venueId }
    });
    
    res.status(200).json({
      success: true,
      message: 'Visit removed'
    });
  } catch (err) {
    next(err);
  }
}; 