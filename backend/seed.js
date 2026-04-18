/**
 * Seed Script — populates MongoDB with demo data
 * Run: node seed.js
 * Reset: node seed.js --reset
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User        = require('./models/User');
const Student     = require('./models/Student');
const Room        = require('./models/Room');
const Complaint   = require('./models/Complaint');
const Maintenance = require('./models/Maintenance');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_db';

const seedUsers = [
  { name: 'Admin User',   email: 'admin@hostel.com',  password: 'admin123',  role: 'admin' },
  { name: 'Mr. Sharma',   email: 'warden@hostel.com', password: 'warden123', role: 'warden' },
  { name: 'Ravi Kumar',   email: 'ravi@student.com',  password: 'ravi123',   role: 'student' },
  { name: 'Ananya Singh', email: 'ananya@student.com',password: 'ananya123', role: 'student' },
  { name: 'Tech Staff',   email: 'staff@hostel.com',  password: 'staff123',  role: 'maintenance_staff' },
];

const seedRooms = [
  { roomNumber: '101', capacity: 2, status: 'available' },
  { roomNumber: '102', capacity: 3, status: 'occupied' },
  { roomNumber: '103', capacity: 2, status: 'occupied' },
  { roomNumber: '104', capacity: 4, status: 'available' },
  { roomNumber: '201', capacity: 2, status: 'occupied' },
  { roomNumber: '202', capacity: 3, status: 'maintenance' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    const isReset = process.argv.includes('--reset');
    if (isReset) {
      await Promise.all([
        User.deleteMany({}),
        Student.deleteMany({}),
        Room.deleteMany({}),
        Complaint.deleteMany({}),
        Maintenance.deleteMany({}),
      ]);
      console.log('All collections cleared');
    }

    // Check if already seeded
    const existing = await User.findOne({ email: 'admin@hostel.com' });
    if (existing && !isReset) {
      console.log('Database already seeded. Use --reset to reseed.');
      process.exit(0);
    }

    // 1. Create users (passwords are hashed by the pre-save hook)
    console.log('Creating users...');
    const createdUsers = await User.create(seedUsers);
    const userMap = {};
    createdUsers.forEach(u => { userMap[u.email] = u; });

    // 2. Create rooms
    console.log('Creating rooms...');
    await Room.create(seedRooms);

    // 3. Create student profiles
    console.log('Creating student profiles...');
    const students = await Student.create([
      {
        userId:     userMap['ravi@student.com']._id,
        name:       'Ravi Kumar',
        roomNumber: '102',
        contact:    '9876543210',
      },
      {
        userId:     userMap['ananya@student.com']._id,
        name:       'Ananya Singh',
        roomNumber: '103',
        contact:    '9876543211',
      },
    ]);

    const [ravi, ananya] = students;
    const staff = userMap['staff@hostel.com'];

    // 4. Create complaints
    console.log('Creating complaints...');
    const complaints = await Complaint.create([
      {
        studentId:   ravi._id,
        roomNumber:  '102',
        description: 'Electricity failure in room, lights not working since yesterday.',
        status:      'Resolved',
        priority:    'High',
        priorityReason: 'Safety risk — no power in room',
      },
      {
        studentId:   ananya._id,
        roomNumber:  '103',
        description: 'Plumbing issue — water leaking from bathroom tap continuously.',
        status:      'In Progress',
        priority:    'Medium',
        priorityReason: 'Water wastage, needs prompt repair',
      },
      {
        studentId:   ravi._id,
        roomNumber:  '102',
        description: 'Internet connectivity issue, WiFi not working in the room.',
        status:      'Open',
        priority:    null,
      },
    ]);

    const [c1, c2] = complaints;

    // 5. Create maintenance tasks
    console.log('Creating maintenance tasks...');
    await Maintenance.create([
      {
        complaintId:   c1._id,
        staffId:       staff._id,
        status:        'Resolved',
        scheduledDate: new Date('2025-03-02'),
        notes:         'Replaced blown fuse. Issue resolved.',
      },
      {
        complaintId:   c2._id,
        staffId:       staff._id,
        status:        'In Progress',
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        notes:         'Replacement washer ordered.',
      },
    ]);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Demo login credentials:');
    console.log('  Admin:       admin@hostel.com   / admin123');
    console.log('  Warden:      warden@hostel.com  / warden123');
    console.log('  Student:     ravi@student.com   / ravi123');
    console.log('  Student:     ananya@student.com / ananya123');
    console.log('  Maintenance: staff@hostel.com   / staff123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
