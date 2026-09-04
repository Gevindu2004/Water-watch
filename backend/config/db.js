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
  ],
  tanks: [
    {
      _id: 'tank-401',
      name: 'Parakrama Samudraya',
      location: 'Polonnaruwa Central',
      capacity: 1000000,
      currentLevel: 780000,
      percentage: 78,
      status: 'NORMAL',
      nearbyVillages: ['Hingurakgoda', 'Polonnaruwa Town'],
      history: [
        { day: 'Mon', percentage: 85 },
        { day: 'Tue', percentage: 82 },
        { day: 'Wed', percentage: 80 },
        { day: 'Thu', percentage: 78 },
        { day: 'Fri', percentage: 78 },
        { day: 'Sat', percentage: 77 },
        { day: 'Sun', percentage: 78 }
      ],
      lastUpdated: new Date()
    },
    {
      _id: 'tank-402',
      name: 'Minneriya Tank',
      location: 'Minneriya Reserve',
      capacity: 500000,
      currentLevel: 90000,
      percentage: 18,
      status: 'CRITICAL',
      nearbyVillages: ['Siripura', 'Bakamuna'],
      history: [
        { day: 'Mon', percentage: 38 },
        { day: 'Tue', percentage: 30 },
        { day: 'Wed', percentage: 24 },
        { day: 'Thu', percentage: 20 },
        { day: 'Fri', percentage: 18 },
        { day: 'Sat', percentage: 18 },
        { day: 'Sun', percentage: 18 }
      ],
      lastUpdated: new Date()
    },
    {
      _id: 'tank-403',
      name: 'Kaudulla Tank',
      location: 'Medirigiriya Division',
      capacity: 400000,
      currentLevel: 140000,
      percentage: 35,
      status: 'WARNING',
      nearbyVillages: ['Medirigiriya', 'Rotawewa'],
      history: [
        { day: 'Mon', percentage: 50 },
        { day: 'Tue', percentage: 44 },
        { day: 'Wed', percentage: 40 },
        { day: 'Thu', percentage: 38 },
        { day: 'Fri', percentage: 36 },
        { day: 'Sat', percentage: 35 },
        { day: 'Sun', percentage: 35 }
      ],
      lastUpdated: new Date()
    },
    {
      _id: 'tank-404',
      name: 'Giritale Tank',
      location: 'Giritale Park',
      capacity: 300000,
      currentLevel: 195000,
      percentage: 65,
      status: 'NORMAL',
      nearbyVillages: ['Welikanda'],
      history: [
        { day: 'Mon', percentage: 72 },
        { day: 'Tue', percentage: 70 },
        { day: 'Wed', percentage: 68 },
        { day: 'Thu', percentage: 66 },
        { day: 'Fri', percentage: 65 },
        { day: 'Sat', percentage: 65 },
        { day: 'Sun', percentage: 65 }
      ],
      lastUpdated: new Date()
    }
  ],
  users: [
    { _id: 'usr-1', name: 'John', email: 'resident@test.com', role: 'resident', village: 'Siripura', status: 'Active' },
    { _id: 'usr-2', name: 'Kamal', email: 'officer@test.com', role: 'officer', village: '—', status: 'Active' },
    { _id: 'usr-3', name: 'Admin', email: 'admin@test.com', role: 'admin', village: '—', status: 'Active' },
    { _id: 'usr-4', name: 'Sarath Kumara', email: 'sarath@test.com', role: 'officer', village: '—', status: 'Active' }
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
