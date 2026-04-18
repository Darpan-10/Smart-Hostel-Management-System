const mongoose = require('mongoose');

// Section 11: Students collection schema
const StudentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  contact: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
