const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password
    });

    // Generate token
    const token = user.getSignedJwtToken();

    // Remove password from response
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    // Remove password from response
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      location: user.location,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      profileImage: user.profileImage
    };

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(`[auth.js] User ${user._id} retrieved their profile`); 

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @desc    Validate user token
// @route   GET /api/auth/validate
// @access  Private
router.get('/validate', protect, async (req, res) => {
  try {
    console.log(`[auth.js] Token validated successfully for user: ${req.user._id}`);
    
    res.status(200).json({
      success: true,
      valid: true,
      message: 'Token is valid',
      userId: req.user._id
    });
  } catch (err) {
    console.error('[auth.js] Token validation error:', err);
    res.status(401).json({ 
      success: false, 
      valid: false,
      message: 'Token validation failed' 
    });
  }
});

// STAFF AUTH ROUTES
// Import staff auth controller
const {
  staffLogin,
  staffLogout,
  forgotPassword,
  resetPassword,
  validateToken
} = require('../controllers/staffAuth');
const { protectStaff } = require('../middleware/staffAuth');

// Staff auth routes
router.post('/staff/login', staffLogin);
router.get('/staff/logout', protectStaff, staffLogout);
router.post('/staff/forgotpassword', forgotPassword);
router.put('/staff/resetpassword/:resettoken', resetPassword);
router.post('/staff/validate', validateToken);

module.exports = router;