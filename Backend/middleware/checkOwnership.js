const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Middleware to verify resource ownership
 * @param {string} model - Mongoose model name (e.g., 'Venue', 'Offer')
 * @param {string} paramName - URL parameter name that contains the resource ID (default: 'id')
 * @returns {function} Express middleware function
 */
const checkOwnership = (model, paramName = 'id') => async (req, res, next) => {
  try {
    console.log(`[checkOwnership] Checking ownership for ${model}`);
    console.log(`[checkOwnership] User:`, req.user ? {id: req.user.id, role: req.user.role} : 'No user in request');
    console.log(`[checkOwnership] Resource ID:`, req.params[paramName]);
    
    // Get the model
    const Model = mongoose.model(model);
    
    // Get resource ID from params
    const resourceId = req.params[paramName];
    
    if (!resourceId || !mongoose.Types.ObjectId.isValid(resourceId)) {
      console.log(`[checkOwnership] Invalid ${model} ID: ${resourceId}`);
      return next(new ErrorResponse(`Invalid ${model} ID`, 400));
    }
    
    // Find the resource
    const resource = await Model.findById(resourceId);
    
    // Check if resource exists
    if (!resource) {
      console.log(`[checkOwnership] ${model} not found with id: ${resourceId}`);
      return next(new ErrorResponse(`${model} not found with id of ${resourceId}`, 404));
    }
    
    console.log(`[checkOwnership] Resource owner: ${resource.owner}`);
    
    // Check ownership by comparing the resource owner with logged in user
    // Allow admin users to bypass ownership check
    if (resource.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      console.log(`[checkOwnership] Unauthorized: User ${req.user.id} (${req.user.role}) does not own this ${model}`);
      return next(new ErrorResponse(`Not authorized to access this ${model}`, 403));
    }
    
    console.log(`[checkOwnership] Access granted: User ${req.user.id} authorized for ${model} ${resourceId}`);
    
    // Add resource to request object for potential later use
    req.resource = resource;
    
    next();
  } catch (err) {
    console.error(`[checkOwnership] Error:`, err);
    next(err);
  }
};

module.exports = checkOwnership; 