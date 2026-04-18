const express = require('express');
const router = express.Router();
const { getUsers, getUsersByRole, getUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// GET /api/users              — all users (admin only)
// GET /api/users?role=...     — filter by role (admin + warden)
router.get('/', authorize('admin', 'warden'), getUsersByRole);

// GET /api/users/:id
router.get('/:id', authorize('admin'), getUser);

// DELETE /api/users/:id
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
