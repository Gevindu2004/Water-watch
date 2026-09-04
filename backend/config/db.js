const mongoose = require('mongoose');
const {
  initialShortageReports,
  initialTanks,
  initialBowsers,
  initialDeliveryLogs,
  initialResidentNotifications
} = require('../data/seedData');

// In-memory data store for fallback mode (zero-dependency, guarantees 100% demo uptime)
const memoryStore = {
  shortageReports: JSON.parse(JSON.stringify(initialShortageReports)),
  tanks: JSON.parse(JSON.stringify(initialTanks)),
  bowsers: JSON.parse(JSON.stringify(initialBowsers)),
  deliveryLogs: JSON.parse(JSON.stringify(initialDeliveryLogs)),
  residentNotifications: JSON.parse(JSON.stringify(initialResidentNotifications)),
  reset() {
    this.shortageReports = JSON.parse(JSON.stringify(initialShortageReports));
    this.tanks = JSON.parse(JSON.stringify(initialTanks));
    this.bowsers = JSON.parse(JSON.stringify(initialBowsers));
    this.deliveryLogs = JSON.parse(JSON.stringify(initialDeliveryLogs));
    this.residentNotifications = JSON.parse(JSON.stringify(initialResidentNotifications));
    console.log('🔄 Data store reset to official demo scenario.');
  }
};

let dbMode = 'memory'; // 'mongodb' | 'memory'

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/waterwatch';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    dbMode = 'mongodb';
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return { mode: 'mongodb', host: conn.connection.host };
  } catch (err) {
    dbMode = 'memory';
    console.warn(`⚠️ MongoDB connection unavailable (${err.message}).`);
    console.log(`🚀 Operating in High-Availability In-Memory Demo Mode with preloaded Polonnaruwa dataset.`);
    return { mode: 'memory', message: 'In-Memory Demo Engine Active' };
  }
};

const getDBMode = () => dbMode;
const getMemoryStore = () => memoryStore;

module.exports = {
  connectDB,
  getDBMode,
  getMemoryStore
};
