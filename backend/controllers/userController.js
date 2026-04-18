const User = require('../models/User');
const Student = require('../models/Student');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get users by role (e.g. ?role=maintenance_staff)
// @route   GET /api/users?role=...
// @access  Private (admin, warden)
const getUsersByRole = async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter).sort({ name: 1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private (admin)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a user (and their student profile if applicable)
// @route   DELETE /api/users/:id
// @access  Private (admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // If student, also remove their student profile
    if (user.role === 'student') {
      await Student.findOneAndDelete({ userId: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, getUsersByRole, getUser, deleteUser };
