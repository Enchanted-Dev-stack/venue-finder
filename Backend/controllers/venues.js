const Venue = require('../models/Venue');
const ErrorResponse = require('../utils/errorResponse');
// const geocoder = require('../utils/geocoder');
const path = require('path');
const fs = require('fs');
const checkOwnership = require('../middleware/checkOwnership');

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
exports.getVenues = async (req, res, next) => {
  try {
    // Copy query
    const reqQuery = { ...req.query };

    // Handle special case for owner=current
    if (reqQuery.owner === 'current' && req.user) {
      reqQuery.owner = req.user.id;
    } else if (reqQuery.owner === 'current') {
      // If owner=current but no authenticated user, return empty array
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

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
    console.log('[getVenue] Request received for venue:', req.params.id);
    console.log('[getVenue] User in request:', req.user ? {id: req.user.id, role: req.user.role} : 'No user in request');
    
    const venue = await Venue.findById(req.params.id).populate('reviews');

    if (!venue) {
      console.log(`[getVenue] Venue not found with id: ${req.params.id}`);
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
      );
    }

    console.log(`[getVenue] Venue found. Owner: ${venue.owner}`);
    res.status(200).json({
      success: true,
      data: venue
    });
  } catch (err) {
    console.error('[getVenue] Error:', err);
    next(err);
  }
};

// @desc    Create new venue
// @route   POST /api/venues
// @access  Private
exports.createVenue = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.owner = req.user.id;
    
    // Create venue with all the received data
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
    console.log('[updateVenue] Request received for venue:', req.params.id);
    console.log('[updateVenue] User in request:', req.user ? {id: req.user.id, role: req.user.role} : 'No user in request');
    
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      console.log(`[updateVenue] Venue not found with id: ${req.params.id}`);
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
      );
    }

    console.log(`[updateVenue] Venue found. Owner: ${venue.owner}`);
    // Ownership is now checked by middleware
    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    console.log(`[updateVenue] Venue updated successfully`);
    res.status(200).json({
      success: true,
      data: venue
    });
  } catch (err) {
    console.error('[updateVenue] Error:', err);
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

    // Ownership is now checked by middleware
    
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

    // Ownership is now checked by middleware

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
    file.name = `photo_${venue._id}_${Date.now()}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/venues/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      // Add the photo to the venue's media.images array
      await Venue.findByIdAndUpdate(req.params.id, {
        $push: { 'media.images': file.name }
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

// @desc    Upload venue promo video
// @route   PUT /api/venues/:id/promo-video
// @access  Private
exports.uploadPromoVideo = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
      );
    }

    // Ownership is now checked by middleware

    // Update video URL and hasPromoVideo status
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return next(new ErrorResponse(`Please provide a video URL`, 400));
    }

    await Venue.findByIdAndUpdate(req.params.id, {
      'media.promoVideoUrl': videoUrl,
      'media.hasPromoVideo': true
    });

    res.status(200).json({
      success: true,
      data: { videoUrl }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload venue 360 tour
// @route   PUT /api/venues/:id/tour360
// @access  Private
exports.upload360Tour = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return next(
        new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
      );
    }

    // Ownership is now checked by middleware

    // Update tour URL and has360Tour status
    const { tourUrl } = req.body;

    if (!tourUrl) {
      return next(new ErrorResponse(`Please provide a tour URL`, 400));
    }

    await Venue.findByIdAndUpdate(req.params.id, {
      'media.tour360Url': tourUrl,
      'media.has360Tour': true
    });

    res.status(200).json({
      success: true,
      data: { tourUrl }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit venue from form (comprehensive submission)
// @route   POST /api/venues/submit-form
// @access  Private
exports.submitVenueForm = async (req, res, next) => {
  try {
    // Add user to data
    const userData = {
      owner: req.user.id,
    };

    const formData = req.body;
    
    // Map the form data structure to the Venue schema structure
    const venueData = {
      ...userData,
      // General info
      name: formData.generalInfo.name,
      description: formData.generalInfo.description,
      address: formData.generalInfo.address,
      category: formData.generalInfo.type, // Using the type from form as category
      capacity: formData.generalInfo.capacity,
      phone: formData.generalInfo.contactPhone,
      
      // Location
      location: {
        type: 'Point',
        coordinates: formData.generalInfo.coordinates 
          ? [formData.generalInfo.coordinates.longitude, formData.generalInfo.coordinates.latitude] 
          : [0, 0], // Default if not provided
        city: formData.generalInfo.city,
        zipcode: formData.generalInfo.zipCode,
        // Other location fields can be added if available
      },
      
      // Media
      media: {
        images: formData.media.images || [],
        hasPromoVideo: formData.media.hasPromoVideo || false,
        promoVideoUrl: formData.media.promoVideoUrl || '',
        has360Tour: formData.media.has360Tour || false,
        tour360Url: formData.media.tour360Url || '',
      },
      
      // Social and contact
      email: formData.socialContact.email,
      website: formData.socialContact.website,
      socialLinks: {
        facebook: formData.socialContact.socialLinks.facebook || '',
        instagram: formData.socialContact.socialLinks.instagram || '',
        twitter: formData.socialContact.socialLinks.twitter || '',
        linkedin: formData.socialContact.socialLinks.linkedin || '',
        youtube: formData.socialContact.socialLinks.youtube || '',
      },
      
      // Amenities
      amenities: formData.amenities.features || [],
      eventTypes: formData.amenities.eventTypes || [],
      cateringOptions: formData.amenities.cateringOptions || 'in_house',
      
      // Pricing
      pricing: formData.pricing || '$',
      pricingMenu: formData.pricingMenu.pricing.map(item => ({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        isPopular: item.isPopular,
        // Add image if it exists in the frontend data model
        image: item.image || null,
        dietaryInfo: item.dietaryInfo || []
      })),
      packages: formData.pricingMenu.packages.map(pkg => ({
        name: pkg.name,
        description: pkg.description,
        features: pkg.features,
        price: pkg.price,
        duration: pkg.duration,
        isPopular: pkg.isPopular,
        minGuests: pkg.minGuests,
        maxGuests: pkg.maxGuests
      })),
      
      // Theme and customization
      theme: formData.customization.theme || 'default',
      customFields: formData.customization.customFields || [],
      
      // Operating Hours
      operatingHours: {
        monday: formData.operatingHours.monday || { open: '', close: '', isClosed: true },
        tuesday: formData.operatingHours.tuesday || { open: '', close: '', isClosed: true },
        wednesday: formData.operatingHours.wednesday || { open: '', close: '', isClosed: true },
        thursday: formData.operatingHours.thursday || { open: '', close: '', isClosed: true },
        friday: formData.operatingHours.friday || { open: '', close: '', isClosed: true },
        saturday: formData.operatingHours.saturday || { open: '', close: '', isClosed: true },
        sunday: formData.operatingHours.sunday || { open: '', close: '', isClosed: true }
      },
    };
    
    // Create venue with the mapped data
    const venue = await Venue.create(venueData);

    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (err) {
    console.error('Error submitting venue form:', err);
    next(err);
  }
}; 