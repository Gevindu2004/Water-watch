import mongoose from 'mongoose';

const ShortageSchema = new mongoose.Schema({
  village: { type: String, required: true },
  reporter: { type: String, default: 'Resident' },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  status: { type: String, enum: ['OPEN', 'ASSIGNED', 'RESOLVED'], default: 'OPEN' },
  reportedAt: { type: Date, default: Date.now },
  description: { type: String }
});

export const Shortage = mongoose.model('Shortage', ShortageSchema);

const DeliverySchema = new mongoose.Schema({
  bowserId: { type: String, required: true },
  driverName: { type: String, required: true },
  targetVillage: { type: String, required: true },
  capacityLiters: { type: Number, default: 5000 },
  status: { type: String, enum: ['SCHEDULED', 'IN_TRANSIT', 'COMPLETED'], default: 'SCHEDULED' },
  scheduledTime: { type: Date, default: Date.now }
});

export const Delivery = mongoose.model('Delivery', DeliverySchema);
