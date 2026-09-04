const mongoose = require('mongoose');
const { getDBMode, getMemoryStore } = require('../config/db');

const BowserSchema = new mongoose.Schema(
  {
    bowserId: { type: String, required: true, unique: true, index: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    capacityLiters: { type: Number, required: true },
    currentLocation: { type: String, required: true },
    status: {
      type: String,
      enum: ['available', 'dispatched', 'maintenance'],
      default: 'available'
    },
    etaMinutes: { type: Number, default: 30 },
    estimatedArrivalTime: { type: String, default: '2:15 PM' },
    assignedVillageId: { type: String, default: null },
    licensePlate: { type: String, default: '' }
  },
  { timestamps: true }
);

BowserSchema.statics.findBowsers = async function (filter = {}) {
  if (getDBMode() === 'mongodb') {
    return this.find(filter).lean();
  }
  const store = getMemoryStore();
  let bowsers = store.bowsers;
  if (filter.status) {
    bowsers = bowsers.filter(b => b.status === filter.status);
  }
  if (filter.bowserId) {
    bowsers = bowsers.filter(b => b.bowserId === filter.bowserId);
  }
  return JSON.parse(JSON.stringify(bowsers));
};

BowserSchema.statics.findByBowserId = async function (bowserId) {
  if (getDBMode() === 'mongodb') {
    return this.findOne({ bowserId }).lean();
  }
  const store = getMemoryStore();
  const bowser = store.bowsers.find(b => b.bowserId === bowserId);
  return bowser ? JSON.parse(JSON.stringify(bowser)) : null;
};

BowserSchema.statics.updateBowser = async function (bowserId, updateData) {
  if (getDBMode() === 'mongodb') {
    return this.findOneAndUpdate({ bowserId }, { $set: updateData }, { new: true }).lean();
  }
  const store = getMemoryStore();
  const index = store.bowsers.findIndex(b => b.bowserId === bowserId);
  if (index !== -1) {
    store.bowsers[index] = { ...store.bowsers[index], ...updateData };
    return JSON.parse(JSON.stringify(store.bowsers[index]));
  }
  return null;
};

module.exports = mongoose.model('Bowser', BowserSchema);
