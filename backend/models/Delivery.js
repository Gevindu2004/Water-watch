const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  bowserId: {
    type: String,
    required: [true, 'Bowser ID is required'],
    trim: true
  },
  villageId: {
    type: String,
    required: [true, 'Village ID/Name is required'],
    trim: true
  },
  distributionPoint: {
    type: String,
    required: [true, 'Distribution Point location is required'],
    trim: true
  },
  scheduledDate: {
    type: String,
    required: [true, 'Scheduled Date is required']
  },
  estimatedArrival: {
    type: String,
    required: [true, 'Estimated Arrival time is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Water Capacity in Liters is required'],
    min: [100, 'Capacity must be at least 100L']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'On The Way', 'Distributing', 'Completed', 'Delayed'],
    default: 'Scheduled'
  },
  peopleWaiting: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Delivery', deliverySchema);
