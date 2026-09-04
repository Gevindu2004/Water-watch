const mongoose = require('mongoose');
const { getDBMode, getMemoryStore } = require('../config/db');

const ResidentNotificationSchema = new mongoose.Schema(
  {
    notificationId: { type: String, required: true, unique: true },
    villageId: { type: String, required: true },
    villageName: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: { type: String, default: 'SMS / Resident Mobile App' },
    sentAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['alert', 'dispatch', 'info'], default: 'dispatch' },
    bowserId: { type: String },
    eta: { type: String }
  },
  { timestamps: true }
);

ResidentNotificationSchema.statics.createNotification = async function (notifData) {
  if (getDBMode() === 'mongodb') {
    return this.create(notifData);
  }
  const store = getMemoryStore();
  const newNotif = {
    _id: `notif-${Date.now()}`,
    notificationId: notifData.notificationId || `NOTIF-${Date.now()}`,
    ...notifData,
    sentAt: new Date().toISOString()
  };
  store.residentNotifications.unshift(newNotif);
  return JSON.parse(JSON.stringify(newNotif));
};

ResidentNotificationSchema.statics.findNotifications = async function (filter = {}) {
  if (getDBMode() === 'mongodb') {
    return this.find(filter).sort({ sentAt: -1 }).lean();
  }
  const store = getMemoryStore();
  let notifs = store.residentNotifications;
  if (filter.villageId) {
    notifs = notifs.filter(n => n.villageId === filter.villageId);
  }
  return JSON.parse(JSON.stringify(notifs));
};

module.exports = mongoose.model('ResidentNotification', ResidentNotificationSchema);
