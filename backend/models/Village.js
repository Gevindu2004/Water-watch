const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentWaterStatus: { 
    type: String, 
    enum: ['Normal', 'Low', 'Warning', 'Critical'],
    default: 'Normal'
  },
  daysWithoutWater: { type: Number, default: 0 },
  affectedPopulation: { type: Number, default: 0 },
  tankLevel: { type: Number, default: 100 }, // Percentage
  lastWaterReceived: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Village', villageSchema);
