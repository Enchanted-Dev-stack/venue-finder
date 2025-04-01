const Review = require('../models/Review');
const Venue = require('../models/Venue');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get reviews
// @route   GET /api/reviews
// @route   GET /api/venues/:venueId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    if (req.params.venueId) {
      const reviews = await Review.find({ venue: req.params.venueId });

      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } else {
      // For all reviews, use pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 25;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await Review.countDocuments();

      const reviews = await Review.find()
        .skip(startIndex)
        .limit(limit);

      // Pagination result
      const pagination = {};

      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit
        };
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        };
      }

      res.status(200).json({
        success: true,
        count: reviews.length,
        pagination,
        data: reviews
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: 'venue',
      select: 'name description address'
    });

    if (!review) {
      return next(
        new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add review
// @route   POST /api/venues/:venueId/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    req.body.venue = req.params.venueId;
    req.body.user = req.user.id;
    req.body.userName = req.user.fullName;
    req.body.userImage = req.user.profileImage || 'default-profile.jpg';

    const venue = await Venue.findById(req.params.venueId);

    if (!venue) {
      return next(
        new ErrorResponse(
          `No venue found with the id of ${req.params.venueId}`,
          404
        )
      );
    }

    // Check if user already reviewed this venue
    const existingReview = await Review.findOne({
      user: req.user.id,
      venue: req.params.venueId
    });

    if (existingReview) {
      return next(
        new ErrorResponse('You have already reviewed this venue', 400)
      );
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return next(
        new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to update review`, 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(
        new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to delete review`, 401));
    }

    await review.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 