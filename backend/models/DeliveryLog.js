const mongoose = require('mongoose');
const { getDBMode, getMemoryStore } = require('../config/db');

const DeliveryLogSchema = new mongoose.Schema(
  {
    deliveryId: { type: String, required: true, unique: true },
    villageId: { type: String, required: true },
    villageName: { type: String, required: true },
    bowserId: { type: String, required: true },
    capacityDelivered: { type: Number, required: true },
    dispatchedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['dispatched', 'in-transit', 'delivering', 'completed'],
      default: 'dispatched'
    },
    approvedBy: { type: String, default: 'Regional Water Authority Officer' },
    targetEta: { type: String, default: '2:15 PM' }
  },
  { timestamps: true }
);

DeliveryLogSchema.statics.createLog = async function (logData) {
  if (getDBMode() === 'mongodb') {
    return this.create(logData);
  }
  const store = getMemoryStore();
  const newLog = {
    _id: `del-${Date.now()}`,
    deliveryId: logData.deliveryId || `DLV-${Date.now()}`,
    ...logData,
    dispatchedAt: new Date().toISOString()
  };
  store.deliveryLogs.unshift(newLog);
  return JSON.parse(JSON.stringify(newLog));
};

DeliveryLogSchema.statics.findLogs = async function (filter = {}) {
  if (getDBMode() === 'mongodb') {
    return this.find(filter).sort({ dispatchedAt: -1 }).lean();
  }
  const store = getMemoryStore();
  return JSON.parse(JSON.stringify(store.deliveryLogs));
};

module.exports = mongoose.model('DeliveryLog', DeliveryLogSchema);
