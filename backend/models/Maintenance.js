const mongoose = require('mongoose');

// Section 11: Maintenance collection schema
const MaintenanceSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['In Progress', 'Resolved'],
    default: 'In Progress'
  },
  scheduledDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
