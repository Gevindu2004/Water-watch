import mongoose from 'mongoose';

export const calculateStatus = (percentage, thresholds = { normal: 70, low: 40, warning: 20 }) => {
  const norm = thresholds?.normal ?? 70;
  const low = thresholds?.low ?? 40;
  const warn = thresholds?.warning ?? 20;

  if (percentage >= norm) return 'NORMAL';
  if (percentage >= low) return 'LOW';
  if (percentage >= warn) return 'WARNING';
  return 'CRITICAL';
};

const HistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  level: { type: Number, required: true },
  percentage: { type: Number, required: true },
  status: { type: String, required: true }
}, { _id: false });

const VillageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  riskLevel: { type: String, enum: ['NORMAL', 'LOW', 'WARNING', 'CRITICAL'], default: 'NORMAL' },
  distanceKm: { type: Number },
  population: { type: Number }
}, { _id: false });

const TankSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, default: 'Polonnaruwa District' },
  capacity: { type: Number, required: true }, // Max Capacity in MCM (Million Cubic Meters)
  currentLevel: { type: Number, required: true }, // Current water volume in MCM
  percentage: { type: Number, required: true },
  status: { type: String, enum: ['NORMAL', 'LOW', 'WARNING', 'CRITICAL'], default: 'NORMAL' },
  thresholds: {
    normal: { type: Number, default: 70 },
    low: { type: Number, default: 40 },
    warning: { type: Number, default: 20 }
  },
  lastUpdated: { type: Date, default: Date.now },
  history: [HistorySchema],
  nearbyVillages: [VillageSchema]
}, {
  timestamps: true
});

// Pre-save middleware to calculate percentage & status
TankSchema.pre('save', function(next) {
  if (this.capacity > 0) {
    this.percentage = Math.round((this.currentLevel / this.capacity) * 100);
  } else {
    this.percentage = 0;
  }
  
  this.status = calculateStatus(this.percentage, this.thresholds);
  this.lastUpdated = new Date();

  next();
});

const Tank = mongoose.model('Tank', TankSchema);
export default Tank;
