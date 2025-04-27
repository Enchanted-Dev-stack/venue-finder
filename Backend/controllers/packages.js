const Package = require('../models/Package');
const Venue = require('../models/Venue');
const { statusCodes, errorMessages } = require('../config/constants');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res) => {
  try {
    const query = {};
    const { venue, packageType, isActive } = req.query;

    // Filter by venue if provided
    if (venue) {
      query.venue = venue;
    }

    // Filter by package type if provided
    if (packageType) {
      query.packageType = packageType;
    }

    // Filter by active status if provided
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const packages = await Package.find(query)
      .populate('venue', 'name location')
      .sort({ createdAt: -1 });

    res.status(statusCodes.OK).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (err) {
    console.error('Error getting packages:', err);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessages.SERVER_ERROR,
      error: err.message
    });
  }
};

// @desc    Get packages for a specific venue
// @route   GET /api/venues/:venueId/packages
// @access  Public
exports.getVenuePackages = async (req, res) => {
  try {
    const { venueId } = req.params;

    // Check if venue exists
    const venueExists = await Venue.exists({ _id: venueId });
    if (!venueExists) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: errorMessages.VENUE_NOT_FOUND
      });
    }

    const packages = await Package.find({ venue: venueId })
      .sort({ createdAt: -1 });

    res.status(statusCodes.OK).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (err) {
    console.error(`Error getting venue packages for venue ${req.params.venueId}:`, err);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessages.SERVER_ERROR,
      error: err.message
    });
  }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
exports.getPackage = async (req, res) => {
  try {
    const packageItem = await Package.findById(req.params.id)
      .populate('venue', 'name location images');

    if (!packageItem) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(statusCodes.OK).json({
      success: true,
      data: packageItem
    });
  } catch (err) {
    console.error(`Error getting package with ID ${req.params.id}:`, err);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessages.SERVER_ERROR,
      error: err.message
    });
  }
};

// @desc    Create new package
// @route   POST /api/packages
// @access  Private
exports.createPackage = async (req, res) => {
  try {
    // Check if venue exists and user has permission
    const venue = await Venue.findById(req.body.venue);
    
    if (!venue) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: errorMessages.VENUE_NOT_FOUND
      });
    }

    // Check if user owns the venue
    if (venue.owner.toString() !== req.user.id) {
      return res.status(statusCodes.FORBIDDEN).json({
        success: false,
        message: errorMessages.UNAUTHORIZED_ACTION
      });
    }

    // Create package
    const newPackage = await Package.create({
      ...req.body,
      venue: venue._id
    });

    res.status(statusCodes.CREATED).json({
      success: true,
      data: newPackage
    });
  } catch (err) {
    console.error('Error creating package:', err);
    
    if (err.name === 'ValidationError') {
      // Extract error messages for each field
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: errors.join(', '),
        error: err.message
      });
    }
    
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessages.SERVER_ERROR,
      error: err.message
    });
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private
exports.updatePackage = async (req, res) => {
  try {
    let packageItem = await Package.findById(req.params.id);

    // Check if package exists
    if (!packageItem) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Get venue to check ownership
    const venue = await Venue.findById(packageItem.venue);
    
    if (!venue) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: errorMessages.VENUE_NOT_FOUND
      });
    }

    // Make sure user owns the venue
    if (venue.owner.toString() !== req.user.id) {
      return res.status(statusCodes.FORBIDDEN).json({
        success: false,
        message: errorMessages.UNAUTHORIZED_ACTION
      });
    }

    // Update package
    packageItem = await Package.findByIdAndUpdate(req.params.id, 
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(statusCodes.OK).json({
      success: true,
      data: packageItem
    });
  } catch (err) {
    console.error(`Error updating package ${req.params.id}:`, err);
    
    if (err.name === 'ValidationError') {
      // Extract error messages for each field
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: errors.join(', '),
        error: err.message
      });
    }
    
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessages.SERVER_ERROR,
      error: err.message
    });
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private
exports.deletePackage = async (req, res) => {
  try {
    const packageItem = await Package.findById(req.params.id);

    // Check if package exists
    if (!packageItem) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Get venue to check ownership
    const venue = await Venue.findById(packageItem.venue);
    
    if (!venue) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: errorMessages.VENUE_NOT_FOUND
      });
    }

    // Make sure user owns the venue
    if (venue.owner.toString() !== req.user.id) {
      return res.status(statusCodes.FORBIDDEN).json({
        success: false,
        message: errorMessages.UNAUTHORIZED_ACTION
      });
    }

    // Remove the package
    await packageItem.deleteOne();

    res.status(statusCodes.OK).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(`Error deleting package ${req.params.id}:`, err);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: errorMessages.SERVER_ERROR,
      error: err.message
    });
  }
};
