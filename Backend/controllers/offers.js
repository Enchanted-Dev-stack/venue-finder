const Offer = require('../models/offer');
const Venue = require('../models/Venue');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
exports.getOffers = async (req, res, next) => {
  try {
    // Copy query
    const reqQuery = { ...req.query };
    
    console.log('User authenticated:', !!req.user);
    if (req.user) console.log('User ID:', req.user.id);

    // Simple approach - if user is authenticated, only show their offers
    if (req.user && !reqQuery.owner && !reqQuery.venue) {
      // Show only offers where this user is the owner
      console.log('Filtering offers by owner:', req.user.id);
      reqQuery.owner = req.user.id;
    } 
    // Handle special case for owner=current
    else if (reqQuery.owner === 'current') {
      if (req.user) {
        // Filter by direct ownership (user created these offers)
        reqQuery.owner = req.user.id;
      } else {
        // If owner=current but no authenticated user, return empty array
        return res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
      }
    }

    // Handle venue-specific offers
    if (reqQuery.venue) {
      // Ensure venue exists
      const venue = await Venue.findById(reqQuery.venue);
      if (!venue) {
        return next(
          new ErrorResponse(`Venue not found with id of ${reqQuery.venue}`, 404)
        );
      }
    }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    console.log('Final query:', queryStr);

    // Finding resources
    let query = Offer.find(JSON.parse(queryStr));

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
    
    // Get total count with the same filters
    const countQuery = JSON.parse(queryStr);
    const total = await Offer.countDocuments(countQuery);

    query = query.skip(startIndex).limit(limit);

    // Populate with venue information
    query = query.populate({
      path: 'venue',
      select: 'name address category'
    });

    // Execute query
    const offers = await query;
    console.log('Found offers:', offers.length);

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
      count: offers.length,
      pagination,
      data: offers
    });
  } catch (err) {
    console.error('Error in getOffers:', err);
    next(err);
  }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Public
exports.getOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id).populate({
      path: 'venue',
      select: 'name address category media owner'
    });

    if (!offer) {
      return next(
        new ErrorResponse(`Offer not found with id of ${req.params.id}`, 404)
      );
    }

    // If user is authenticated, check if they are authorized to view this offer
    // They can view if they own the offer OR own the venue the offer is for
    if (req.user && 
        req.user.role !== 'admin' && 
        offer.owner.toString() !== req.user.id && 
        offer.venue.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse(`Not authorized to view this offer`, 401)
      );
    }

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private
exports.createOffer = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.owner = req.user.id;
    
    // Check if venue exists and user owns it
    const venue = await Venue.findById(req.body.venue);
    
    // Check if venue exists
    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.body.venue}`, 404)
      );
    }
    
    // Make sure user is venue owner or admin
    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to create an offer for this venue`, 401)
      );
    }
    
    // Create offer with all the received data
    const offer = await Offer.create(req.body);

    res.status(201).json({
      success: true,
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private
exports.updateOffer = async (req, res, next) => {
  try {
    let offer = await Offer.findById(req.params.id);

    if (!offer) {
      return next(
        new ErrorResponse(`Offer not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is offer owner or admin
    if (offer.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to update this offer`, 401)
      );
    }

    offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return next(
        new ErrorResponse(`Offer not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is offer owner or admin
    if (offer.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to delete this offer`, 401)
      );
    }

    // Remove offer
    await offer.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get active offers for a venue
// @route   GET /api/venues/:venueId/offers
// @access  Public
exports.getVenueOffers = async (req, res, next) => {
  try {
    const venueId = req.params.venueId;
    
    // Ensure venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${venueId}`, 404)
      );
    }
    
    // Get active offers for the venue
    const offers = await Offer.find({
      venue: venueId,
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });
    
    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (err) {
    next(err);
  }
}; 