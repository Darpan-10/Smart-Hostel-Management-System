const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/rooms',       require('./routes/rooms'));
app.use('/api/complaints',  require('./routes/complaints'));
app.use('/api/maintenance', require('./routes/maintenance'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Smart Hostel Management API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
