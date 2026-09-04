const mongoose = require('mongoose');

const waterReportSchema = new mongoose.Schema({
  village: {
    type: String,
    required: [true, 'Village name is required'],
    trim: true
  },
  waterAvailable: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No'
  },
  lastReceivedDate: {
    type: String,
    required: [true, 'Last received date is required']
  },
  peopleAffected: {
    type: Number,
    required: [true, 'Number of people affected is required'],
    min: 1
  },
  description: {
    type: String,
    default: 'Water shortage reported by residents',
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Assigned', 'Resolved'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'High'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
  waterAvailable: { type: Boolean, required: true },
  lastReceivedDate: { type: Date },
  peopleAffected: { type: Number },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Assigned', 'Resolved'],
    default: 'Pending'
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  }
}, { timestamps: true });

module.exports = mongoose.model('WaterReport', waterReportSchema);
