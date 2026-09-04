const mongoose = require('mongoose');

const bowserSchema = new mongoose.Schema({
  bowserId: {
    type: String,
    required: [true, 'Bowser ID is required'],
    unique: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity in Liters is required'],
    min: [100, 'Capacity must be at least 100L']
  },
  district: {
    type: String,
    default: 'Polonnaruwa',
    trim: true
  },
  currentLocation: {
    type: String,
    default: 'Polonnaruwa Central Depot',
    trim: true
  },
  status: {
    type: String,
    enum: ['Available', 'Assigned', 'On The Way', 'Distributing', 'Completed', 'Delayed'],
    default: 'Available'
  },
  driverName: {
    type: String,
    default: 'Unassigned',
    trim: true
  },
  driverContact: {
    type: String,
    default: 'N/A',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bowser', bowserSchema);
