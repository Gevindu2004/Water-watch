const mongoose = require('mongoose');
const { getDBMode, getMemoryStore } = require('../config/db');

const ShortageReportSchema = new mongoose.Schema(
  {
    villageId: { type: String, required: true, index: true },
    villageName: { type: String, required: true },
    division: { type: String, required: true },
    daysWithoutWater: { type: Number, required: true, default: 0 },
    affectedPeople: { type: Number, required: true, default: 0 },
    alternativeWaterSource: {
      type: String,
      enum: ['none', 'limited', 'adequate'],
      default: 'none'
    },
    alternativeSourceDetails: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'resolved', 'dispatched'],
      default: 'active'
    },
    reportedAt: { type: Date, default: Date.now },
    daysSinceLastDelivery: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Unified access layer supporting MongoDB or In-Memory Store
ShortageReportSchema.statics.findReports = async function (filter = {}) {
  if (getDBMode() === 'mongodb') {
    return this.find(filter).lean();
  }
  const store = getMemoryStore();
  let reports = store.shortageReports;
  if (filter.villageId) {
    reports = reports.filter(r => r.villageId === filter.villageId);
  }
  if (filter.status) {
    reports = reports.filter(r => r.status === filter.status);
  }
  return JSON.parse(JSON.stringify(reports));
};

ShortageReportSchema.statics.findByVillageId = async function (villageId) {
  if (getDBMode() === 'mongodb') {
    return this.findOne({ villageId }).lean();
  }
  const store = getMemoryStore();
  const report = store.shortageReports.find(r => r.villageId === villageId || r.villageName.toLowerCase() === villageId.toLowerCase());
  return report ? JSON.parse(JSON.stringify(report)) : null;
};

ShortageReportSchema.statics.updateReport = async function (villageId, updateData) {
  if (getDBMode() === 'mongodb') {
    return this.findOneAndUpdate({ villageId }, { $set: updateData }, { new: true }).lean();
  }
  const store = getMemoryStore();
  const index = store.shortageReports.findIndex(r => r.villageId === villageId || r.villageName.toLowerCase() === villageId.toLowerCase());
  if (index !== -1) {
    store.shortageReports[index] = { ...store.shortageReports[index], ...updateData };
    return JSON.parse(JSON.stringify(store.shortageReports[index]));
  }
  return null;
};

module.exports = mongoose.model('ShortageReport', ShortageReportSchema);
