// Status codes for API responses
exports.statusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages for API responses
exports.errorMessages = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  DUPLICATE_ENTRY: 'Resource already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_TOKEN: 'Invalid token',
  EXPIRED_TOKEN: 'Token expired',
  MISSING_FIELDS: 'Required fields are missing',
  INVALID_ID: 'Invalid ID format',
  UPLOAD_ERROR: 'Error uploading file',
  PACKAGE_NOT_FOUND: 'Package not found',
  VENUE_NOT_FOUND: 'Venue not found'
};
