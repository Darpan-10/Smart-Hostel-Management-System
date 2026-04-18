const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  allocateRoom
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// PUT /api/rooms/allocate — must come before /:id
router.put('/allocate', authorize('warden', 'admin'), allocateRoom);

// GET /api/rooms
// POST /api/rooms
router.route('/')
  .get(getRooms)
  .post(authorize('admin', 'warden'), createRoom);

// GET /api/rooms/:id
// PUT /api/rooms/:id
// DELETE /api/rooms/:id
router.route('/:id')
  .get(getRoom)
  .put(authorize('admin', 'warden'), updateRoom)
  .delete(authorize('admin'), deleteRoom);

module.exports = router;
