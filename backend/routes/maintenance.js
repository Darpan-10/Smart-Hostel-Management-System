const express = require('express');
const router = express.Router();
const {
  assignMaintenance,
  getMaintenanceTasks,
  updateMaintenanceTask
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// GET /api/maintenance    — all tasks (warden/admin) or own tasks (staff)
// POST /api/maintenance   — assign complaint to staff (warden/admin)
router.route('/')
  .get(getMaintenanceTasks)
  .post(authorize('warden', 'admin'), assignMaintenance);

// PUT /api/maintenance/:id — update task status/notes (staff/warden/admin)
router.put('/:id',
  authorize('maintenance_staff', 'warden', 'admin'),
  updateMaintenanceTask
);

module.exports = router;
