const mongoose = require('mongoose');

const tankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tank name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Tank location is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Total water capacity in Liters is required'],
    min: 1000
  },
  currentLevel: {
    type: Number,
    required: [true, 'Current water level in Liters is required'],
    min: 0
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['NORMAL', 'LOW', 'WARNING', 'CRITICAL'],
    default: 'NORMAL'
  },
  history: [
    {
      day: String,
      date: String,
      percentage: Number,
      level: Number
    }
  ],
  nearbyVillages: [
    {
      type: String,
      trim: true
    }
  ],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Calculate percentage & status before saving
tankSchema.pre('save', function (next) {
  if (this.capacity && this.currentLevel !== undefined) {
    this.percentage = Math.round((this.currentLevel / this.capacity) * 100);
    
    if (this.percentage >= 70) {
      this.status = 'NORMAL';
    } else if (this.percentage >= 40) {
      this.status = 'LOW';
    } else if (this.percentage >= 20) {
      this.status = 'WARNING';
    } else {
      this.status = 'CRITICAL';
    }
  }
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Tank', tankSchema);
