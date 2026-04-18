const Maintenance = require('../models/Maintenance');
const Complaint = require('../models/Complaint');

// @desc    Assign a complaint to maintenance staff
// @route   POST /api/maintenance
// @access  Private (warden, admin)
const assignMaintenance = async (req, res) => {
  try {
    const { complaintId, staffId, scheduledDate, notes } = req.body;

    // Check if already assigned
    const existing = await Maintenance.findOne({ complaintId });
    if (existing) {
      // Reassign
      existing.staffId = staffId;
      existing.scheduledDate = scheduledDate || existing.scheduledDate;
      existing.notes = notes || existing.notes;
      existing.status = 'In Progress';
      await existing.save();

      await Complaint.findByIdAndUpdate(complaintId, { status: 'In Progress' });
      return res.json({ success: true, maintenance: existing });
    }

    const maintenance = await Maintenance.create({
      complaintId,
      staffId,
      scheduledDate: scheduledDate || null,
      notes: notes || ''
    });

    // Update complaint status to In Progress
    await Complaint.findByIdAndUpdate(complaintId, { status: 'In Progress' });

    const populated = await Maintenance.findById(maintenance._id)
      .populate('complaintId', 'description roomNumber status')
      .populate('staffId', 'name email');

    res.status(201).json({ success: true, maintenance: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all maintenance tasks (admin/warden) or own tasks (staff)
// @route   GET /api/maintenance
// @access  Private
const getMaintenanceTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'maintenance_staff') {
      tasks = await Maintenance.find({ staffId: req.user._id })
        .populate('complaintId', 'description roomNumber status studentId')
        .populate('staffId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      tasks = await Maintenance.find()
        .populate('complaintId', 'description roomNumber status studentId')
        .populate('staffId', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update maintenance task status and notes
// @route   PUT /api/maintenance/:id
// @access  Private (maintenance_staff, warden, admin)
const updateMaintenanceTask = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const task = await Maintenance.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    if (status) task.status = status;
    if (notes !== undefined) task.notes = notes;
    await task.save();

    // If resolved, update the linked complaint
    if (status === 'Resolved') {
      await Complaint.findByIdAndUpdate(task.complaintId, { status: 'Resolved' });
    }

    const updated = await Maintenance.findById(task._id)
      .populate('complaintId', 'description roomNumber status')
      .populate('staffId', 'name email');

    res.json({ success: true, maintenance: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { assignMaintenance, getMaintenanceTasks, updateMaintenanceTask };
