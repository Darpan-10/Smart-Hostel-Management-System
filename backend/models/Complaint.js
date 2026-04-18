const mongoose = require('mongoose');

// Section 11: Complaints collection schema
const ComplaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low', null],
    default: null
  },
  priorityReason: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
