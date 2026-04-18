const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (warden, admin)
const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('userId', 'name email role createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get my student profile
// @route   GET /api/students/me
// @access  Private (student)
const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('userId', 'name email createdAt');

    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private (warden, admin)
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email role');

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update student record
// @route   PUT /api/students/:id
// @access  Private (warden, admin)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Also remove the user account
    await User.findByIdAndDelete(student.userId);

    res.json({ success: true, message: 'Student and user account deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStudents, getMyProfile, getStudent, updateStudent, deleteStudent };
