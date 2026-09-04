const mongoose = require('mongoose');

// In-Memory Data Store Fallback if MongoDB is unavailable
const memoryStore = {
  bowsers: [
    {
      _id: 'bowser-102',
      bowserId: 'WB-102',
      registrationNumber: 'WP CP-4821',
      capacity: 5000,
      currentLocation: 'Polonnaruwa Depot',
      status: 'Available',
      driverName: 'Sarath Kumara',
      driverContact: '+94 77 123 4567',
      createdAt: new Date('2026-09-01T08:00:00.000Z')
    },
    {
      _id: 'bowser-105',
      bowserId: 'WB-105',
      registrationNumber: 'WP CP-5102',
      capacity: 5000,
      currentLocation: 'Bakamuna Junction',
      status: 'On The Way',
      driverName: 'Nimal Perera',
      driverContact: '+94 71 987 6543',
      createdAt: new Date('2026-09-01T09:30:00.000Z')
    },
    {
      _id: 'bowser-108',
      bowserId: 'WB-108',
      registrationNumber: 'NC GA-8819',
      capacity: 3000,
      currentLocation: 'Welikanda Center',
      status: 'Completed',
      driverName: 'Kamal Silva',
      driverContact: '+94 76 555 1234',
      createdAt: new Date('2026-09-02T10:15:00.000Z')
    },
    {
      _id: 'bowser-112',
      bowserId: 'WB-112',
      registrationNumber: 'NC GB-3410',
      capacity: 6000,
      currentLocation: 'Hingurakgoda Water Board',
      status: 'Available',
      driverName: 'Sunil Jayasinghe',
      driverContact: '+94 70 333 4455',
      createdAt: new Date('2026-09-03T11:00:00.000Z')
    }
  ],
  deliveries: [
    {
      _id: 'del-201',
      bowserId: 'WB-102',
      villageId: 'Siripura',
      distributionPoint: 'Siripura Temple Junction',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedArrival: '2:00 PM',
      capacity: 5000,
      status: 'Scheduled',
      peopleWaiting: 86,
      createdAt: new Date('2026-09-04T07:00:00.000Z')
    },
    {
      _id: 'del-202',
      bowserId: 'WB-105',
      villageId: 'Bakamuna',
      distributionPoint: 'Bakamuna Maha Vidyalaya Grounds',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedArrival: '3:30 PM',
      capacity: 5000,
      status: 'On The Way',
      peopleWaiting: 120,
      createdAt: new Date('2026-09-04T08:15:00.000Z')
    },
    {
      _id: 'del-203',
      bowserId: 'WB-108',
      villageId: 'Welikanda',
      distributionPoint: 'Welikanda Divisional Secretariat',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedArrival: '5:00 PM',
      capacity: 3000,
      status: 'Completed',
      peopleWaiting: 45,
      createdAt: new Date('2026-09-04T06:30:00.000Z')
    }
  ],
  waterReports: [
    {
      _id: 'rep-301',
      village: 'Siripura',
      waterAvailable: 'No',
      lastReceivedDate: '3 days ago',
      peopleAffected: 120,
      description: 'Severe drought in Siripura North division. Community wells completely dry for 3 consecutive days.',
      status: 'Pending',
      priority: 'High',
      createdAt: new Date('2026-09-04T06:00:00.000Z')
    },
    {
      _id: 'rep-302',
      village: 'Bakamuna',
      waterAvailable: 'No',
      lastReceivedDate: '2 days ago',
      peopleAffected: 80,
      description: 'Pipeline supply cut off due to main pump repair at Bakamuna station.',
      status: 'Verified',
      priority: 'Medium',
      createdAt: new Date('2026-09-04T07:15:00.000Z')
    },
    {
      _id: 'rep-303',
      village: 'Welikanda',
      waterAvailable: 'No',
      lastReceivedDate: '1 day ago',
      peopleAffected: 200,
      description: 'Low water pressure in Welikanda central area.',
      status: 'Pending',
      priority: 'Low',
      createdAt: new Date('2026-09-04T08:00:00.000Z')
    }
  ]
};

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/waterwatch';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to ${uri}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB (${err.message}).`);
    console.log(`[Fallback] Server running in high-performance memory store mode.`);
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, memoryStore, getMongoStatus };
