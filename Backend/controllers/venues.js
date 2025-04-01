const Venue = require('../models/Venue');
const ErrorResponse = require('../utils/errorResponse');
// const geocoder = require('../utils/geocoder');
const path = require('path');
const fs = require('fs');

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
exports.getVenues = async (req, res, next) => {
  try {
    // Copy query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resources
    let query = Venue.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Venue.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const venues = await query;

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
      count: venues.length,
      pagination,
      data: venues
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single venue
// @route   GET /api/venues/:id
// @access  Public
exports.getVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('reviews');

    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: venue
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new venue
// @route   POST /api/venues
// @access  Private
exports.createVenue = async (req, res, next) => {
  try {
    const venue = await Venue.create(req.body);

    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update venue
// @route   PUT /api/venues/:id
// @access  Private
exports.updateVenue = async (req, res, next) => {
  try {
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is venue owner or admin
    // This check would be based on your app's requirements

    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: venue
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete venue
// @route   DELETE /api/venues/:id
// @access  Private
exports.deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is venue owner or admin
    // This check would be based on your app's requirements

    // Remove venue
    await venue.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get venues within a radius
// @route   GET /api/venues/radius/:lat/:lng/:distance
// @access  Public
exports.getVenuesInRadius = async (req, res, next) => {
  try {
    const { lat, lng, distance } = req.params;

    // Parse lat & lng to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    // Find venues within radius using MongoDB's geospatial queries
    const venues = await Venue.find({
      location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    });

    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload photo for venue
// @route   PUT /api/venues/:id/photo
// @access  Private
exports.uploadVenuePhoto = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is venue owner
    // This check would be based on your app's requirements

    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
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
    file.name = `photo_${venue._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/venues/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      // Add the photo to the venue's photos array
      await Venue.findByIdAndUpdate(req.params.id, {
        $push: { photos: file.name }
      });

      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  } catch (err) {
    next(err);
  }
}; 