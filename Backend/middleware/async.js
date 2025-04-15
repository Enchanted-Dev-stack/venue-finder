/**
 * Async Handler Middleware
 * Eliminates the need for try/catch blocks in controllers
 * by wrapping controller functions with a try/catch and passing
 * errors to the next middleware
 */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler; 