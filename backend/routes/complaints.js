const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaintStatus,
  updateComplaintPriority,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET /api/complaints        — all (warden/admin) or own (student)
// POST /api/complaints       — submit new complaint (student)
router.route('/')
  .get(getComplaints)
  .post(authorize('student'), createComplaint);

// GET /api/complaints/:id
// DELETE /api/complaints/:id
router.route('/:id')
  .get(getComplaint)
  .delete(authorize('admin'), deleteComplaint);

// PUT /api/complaints/:id/status
router.put('/:id/status',
  authorize('warden', 'admin', 'maintenance_staff'),
  updateComplaintStatus
);

// PUT /api/complaints/:id/priority
router.put('/:id/priority',
  authorize('warden', 'admin'),
  updateComplaintPriority
);

module.exports = router;
