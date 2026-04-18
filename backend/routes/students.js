const express = require('express');
const router = express.Router();
const {
  getStudents,
  getMyProfile,
  getStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// GET /api/students/me — must come before /:id
router.get('/me', authorize('student'), getMyProfile);

// GET /api/students
router.get('/', authorize('warden', 'admin'), getStudents);

// GET /api/students/:id
// PUT /api/students/:id
// DELETE /api/students/:id
router.route('/:id')
  .get(authorize('warden', 'admin'), getStudent)
  .put(authorize('warden', 'admin'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;
