const express = require('express');
const router = express.Router();

const { 
  getStaff, 
  getStaffMember, 
  createStaffMember, 
  updateStaffMember, 
  deleteStaffMember, 
  assignVenue,
  revokeVenue,
  getMyProfile,
  updateMyProfile
} = require('../controllers/staff');

const { protect, authorize } = require('../middleware/auth');
const { 
  protectStaff, 
  checkPermission, 
  checkVenueAccess,
  createAuditLog
} = require('../middleware/staffAuth');

// Public routes
// None

// Protected routes - Owner access only
router.use(protect);
router.use(authorize('admin', 'owner')); // Only admin users can manage staff

router.route('/')
  .get(getStaff)
  .post(createAuditLog('staff_create'), createStaffMember);

router.route('/:id')
  .get(getStaffMember)
  .put(createAuditLog('staff_update'), updateStaffMember)
  .delete(createAuditLog('staff_delete'), deleteStaffMember);

router.route('/:id/venues/:venueId')
  .post(createAuditLog('staff_venue_assign'), assignVenue)
  .delete(createAuditLog('staff_venue_revoke'), revokeVenue);

// Staff profile routes - accessible by staff and owners
router.route('/profile/me')
  .get(protectStaff, getMyProfile)
  .put(protectStaff, createAuditLog('profile_update'), updateMyProfile);

module.exports = router;
