const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packages');

// Package routes
router
  .route('/')
  .get(getPackages)
  .post(protect, createPackage);

router
  .route('/:id')
  .get(getPackage)
  .put(protect, updatePackage)
  .delete(protect, deletePackage);

module.exports = router;
