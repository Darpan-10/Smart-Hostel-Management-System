const Complaint = require('../models/Complaint');
const Student = require('../models/Student');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (student)
const createComplaint = async (req, res) => {
  try {
    const { description } = req.body;

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const complaint = await Complaint.create({
      studentId: student._id,
      roomNumber: student.roomNumber,
      description
    });

    res.status(201).json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all complaints (warden/admin) or own complaints (student)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (!student) return res.status(404).json({ message: 'Student profile not found' });
      complaints = await Complaint.find({ studentId: student._id })
        .populate('studentId', 'name roomNumber contact')
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find()
        .populate('studentId', 'name roomNumber contact')
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name roomNumber contact');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update complaint status (warden/admin/maintenance_staff)
// @route   PUT /api/complaints/:id/status
// @access  Private (warden, admin, maintenance_staff)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('studentId', 'name roomNumber');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update complaint priority (warden/admin)
// @route   PUT /api/complaints/:id/priority
// @access  Private (warden, admin)
const updateComplaintPriority = async (req, res) => {
  try {
    const { priority, priorityReason } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { priority, priorityReason },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (admin)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ success: true, message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaintStatus,
  updateComplaintPriority,
  deleteComplaint
};
