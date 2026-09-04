const mongoose = require('mongoose');
const { getDBMode, getMemoryStore } = require('../config/db');

const TankSchema = new mongoose.Schema(
  {
    tankId: { type: String, required: true, unique: true, index: true },
    tankName: { type: String, required: true },
    villageId: { type: String, required: true, index: true },
    villageName: { type: String, required: true },
    waterLevelPercentage: { type: Number, required: true, min: 0, max: 100 },
    capacityLiters: { type: Number, required: true },
    currentVolumeLiters: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['critical', 'warning', 'moderate', 'normal'],
      default: 'normal'
    },
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

TankSchema.statics.findTanks = async function (filter = {}) {
  if (getDBMode() === 'mongodb') {
    return this.find(filter).lean();
  }
  const store = getMemoryStore();
  let tanks = store.tanks;
  if (filter.villageId) {
    tanks = tanks.filter(t => t.villageId === filter.villageId);
  }
  return JSON.parse(JSON.stringify(tanks));
};

TankSchema.statics.findByVillageId = async function (villageId) {
  if (getDBMode() === 'mongodb') {
    return this.findOne({ villageId }).lean();
  }
  const store = getMemoryStore();
  const tank = store.tanks.find(t => t.villageId === villageId || t.villageName.toLowerCase() === villageId.toLowerCase());
  return tank ? JSON.parse(JSON.stringify(tank)) : null;
};

module.exports = mongoose.model('Tank', TankSchema);
