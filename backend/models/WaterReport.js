const mongoose = require('mongoose');

const waterReportSchema = new mongoose.Schema({
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
