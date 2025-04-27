const Staff = require('../models/Staff');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken'); // Added jwt import

// @desc    Staff login
// @route   POST /api/auth/staff/login
// @access  Public
exports.staffLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for staff
  const staff = await Staff.findOne({ email }).select('+password');

  if (!staff) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if staff is active
  if (!staff.isActive) {
    return next(new ErrorResponse('This account has been deactivated', 401));
  }

  // Check if password matches
  const isMatch = await staff.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Update last login time
  staff.lastLogin = Date.now();
  await staff.save();

  sendTokenResponse(staff, 200, res);
});

// @desc    Staff logout / clear cookie
// @route   GET /api/auth/staff/logout
// @access  Private
exports.staffLogout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Forgot password
// @route   POST /api/auth/staff/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findOne({ email: req.body.email });

  if (!staff) {
    return next(new ErrorResponse('There is no staff with that email', 404));
  }

  // Get reset token
  const resetToken = crypto
    .randomBytes(20)
    .toString('hex');

  // Create hash and set to resetPasswordToken field
  staff.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration
  staff.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await staff.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/staff/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: staff.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    staff.resetPasswordToken = undefined;
    staff.resetPasswordExpire = undefined;

    await staff.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/staff/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const staff = await Staff.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!staff) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  staff.password = req.body.password;
  staff.resetPasswordToken = undefined;
  staff.resetPasswordExpire = undefined;

  await staff.save();

  sendTokenResponse(staff, 200, res);
});

// @desc    Validate staff token
// @route   POST /api/auth/staff/validate
// @access  Public
exports.validateToken = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new ErrorResponse('No token provided', 400));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    
    // Check if staff exists and is active
    const staff = await Staff.findById(decoded.id);
    
    if (!staff) {
      return next(new ErrorResponse('Invalid token, staff not found', 401));
    }
    
    if (!staff.isActive) {
      return next(new ErrorResponse('Staff account has been deactivated', 401));
    }
    
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      id: staff._id
    });
  } catch (err) {
    return next(new ErrorResponse('Invalid token', 401));
  }
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (staff, statusCode, res) => {
  // Create token
  const token = staff.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 || 30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Strip password from response
  const staffData = {
    _id: staff._id,
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    role: staff.role,
    permissions: staff.permissions,
    venues: staff.venues,
    isActive: staff.isActive,
    profileImage: staff.profileImage
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      staff: staffData
    });
};
