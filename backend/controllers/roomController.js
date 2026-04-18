const Room = require('../models/Room');
const Student = require('../models/Student');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private (admin, warden)
const createRoom = async (req, res) => {
  try {
    const { roomNumber, capacity, status } = req.body;

    const existing = await Room.findOne({ roomNumber });
    if (existing) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = await Room.create({ roomNumber, capacity, status });
    res.status(201).json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update room status
// @route   PUT /api/rooms/:id
// @access  Private (admin, warden)
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private (admin)
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ success: true, message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Allocate a student to a room
// @route   PUT /api/rooms/allocate
// @access  Private (warden, admin)
const allocateRoom = async (req, res) => {
  try {
    const { studentId, roomNumber } = req.body;

    const room = await Room.findOne({ roomNumber });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.status === 'maintenance') {
      return res.status(400).json({ message: 'Room is under maintenance' });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { roomNumber },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: 'Student not found' });

    room.status = 'occupied';
    await room.save();

    res.json({ success: true, student, room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom, allocateRoom };
