const mongoose = require('mongoose');

// In-Memory Data Store Fallback covering Sri Lanka Dry Zone Districts
const memoryStore = {
  bowsers: [
    // Polonnaruwa
    {
      _id: 'bowser-102',
      bowserId: 'WB-102',
      registrationNumber: 'WP CP-4821',
      capacity: 5000,
      district: 'Polonnaruwa',
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
      district: 'Polonnaruwa',
      currentLocation: 'Bakamuna Junction',
      status: 'On The Way',
      driverName: 'Nimal Perera',
      driverContact: '+94 71 987 6543',
      createdAt: new Date('2026-09-01T09:30:00.000Z')
    },
    // Anuradhapura
    {
      _id: 'bowser-201',
      bowserId: 'WB-201',
      registrationNumber: 'NC GA-1002',
      capacity: 6000,
      district: 'Anuradhapura',
      currentLocation: 'Anuradhapura Town Depot',
      status: 'Available',
      driverName: 'Kithsiri Bandara',
      driverContact: '+94 71 444 8899',
      createdAt: new Date('2026-09-02T08:00:00.000Z')
    },
    {
      _id: 'bowser-202',
      bowserId: 'WB-202',
      registrationNumber: 'NC GB-5541',
      capacity: 8000,
      district: 'Anuradhapura',
      currentLocation: 'Mihintale Junction',
      status: 'Distributing',
      driverName: 'Rohan Rathnayake',
      driverContact: '+94 77 999 1122',
      createdAt: new Date('2026-09-02T09:00:00.000Z')
    },
    // Hambantota
    {
      _id: 'bowser-301',
      bowserId: 'WB-301',
      registrationNumber: 'SP HB-7712',
      capacity: 10000,
      district: 'Hambantota',
      currentLocation: 'Ambalantota Depot',
      status: 'Available',
      driverName: 'Jagath Rajapaksha',
      driverContact: '+94 78 222 3344',
      createdAt: new Date('2026-09-03T07:30:00.000Z')
    },
    // Puttalam
    {
      _id: 'bowser-401',
      bowserId: 'WB-401',
      registrationNumber: 'NW PT-3310',
      capacity: 7000,
      district: 'Puttalam',
      currentLocation: 'Anamaduwa Center',
      status: 'Available',
      driverName: 'Chaminda Fernando',
      driverContact: '+94 75 888 7766',
      createdAt: new Date('2026-09-03T10:00:00.000Z')
    }
  ],

  deliveries: [
    // Polonnaruwa
    {
      _id: 'del-201',
      bowserId: 'WB-102',
      district: 'Polonnaruwa',
      villageId: 'Siripura',
      distributionPoint: 'Siripura Temple Junction',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedArrival: '2:00 PM',
      capacity: 5000,
      status: 'Scheduled',
      peopleWaiting: 86,
      createdAt: new Date('2026-09-04T07:00:00.000Z')
    },
    // Anuradhapura
    {
      _id: 'del-204',
      bowserId: 'WB-202',
      district: 'Anuradhapura',
      villageId: 'Mihintale South',
      distributionPoint: 'Mihintale Maha Vidyalaya',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedArrival: '1:30 PM',
      capacity: 8000,
      status: 'On The Way',
      peopleWaiting: 140,
      createdAt: new Date('2026-09-04T08:00:00.000Z')
    },
    // Hambantota
    {
      _id: 'del-205',
      bowserId: 'WB-301',
      district: 'Hambantota',
      villageId: 'Suriyawewa',
      distributionPoint: 'Suriyawewa Hospital Grounds',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedArrival: '4:00 PM',
      capacity: 10000,
      status: 'Scheduled',
      peopleWaiting: 210,
      createdAt: new Date('2026-09-04T08:30:00.000Z')
    }
  ],

  waterReports: [
    {
      _id: 'rep-301',
      village: 'Siripura',
      district: 'Polonnaruwa',
      waterAvailable: 'No',
      lastReceivedDate: '3 days ago',
      peopleAffected: 120,
      description: 'Severe drought in Siripura North division. Community wells dry.',
      status: 'Pending',
      priority: 'High',
      createdAt: new Date('2026-09-04T06:00:00.000Z')
    },
    {
      _id: 'rep-304',
      village: 'Mihintale East',
      district: 'Anuradhapura',
      waterAvailable: 'No',
      lastReceivedDate: '4 days ago',
      peopleAffected: 230,
      description: 'Nuwara Wewa water intake low. No tap supply for 4 days.',
      status: 'Verified',
      priority: 'High',
      createdAt: new Date('2026-09-04T05:30:00.000Z')
    },
    {
      _id: 'rep-305',
      village: 'Suriyawewa Colony',
      district: 'Hambantota',
      waterAvailable: 'No',
      lastReceivedDate: '5 days ago',
      peopleAffected: 310,
      description: 'Critical drought in Suriyawewa farming zone. Deep wells non-functional.',
      status: 'Pending',
      priority: 'High',
      createdAt: new Date('2026-09-04T04:45:00.000Z')
    },
    {
      _id: 'rep-306',
      village: 'Anamaduwa West',
      district: 'Puttalam',
      waterAvailable: 'No',
      lastReceivedDate: '2 days ago',
      peopleAffected: 180,
      description: 'Saltwater intrusion in groundwater wells.',
      status: 'Pending',
      priority: 'High',
      createdAt: new Date('2026-09-04T07:20:00.000Z')
    }
  ],

  tanks: [
    // Polonnaruwa
    {
      _id: 'tank-401',
      name: 'Parakrama Samudraya',
      district: 'Polonnaruwa',
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
        { day: 'Fri', percentage: 78 }
      ],
      lastUpdated: new Date()
    },
    {
      _id: 'tank-402',
      name: 'Minneriya Tank',
      district: 'Polonnaruwa',
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
        { day: 'Fri', percentage: 18 }
      ],
      lastUpdated: new Date()
    },
    // Anuradhapura
    {
      _id: 'tank-405',
      name: 'Nuwara Wewa',
      district: 'Anuradhapura',
      location: 'Anuradhapura East',
      capacity: 450000,
      currentLevel: 67500,
      percentage: 15,
      status: 'CRITICAL',
      nearbyVillages: ['Mihintale', 'Rambewa'],
      history: [
        { day: 'Mon', percentage: 28 },
        { day: 'Tue', percentage: 22 },
        { day: 'Wed', percentage: 19 },
        { day: 'Thu', percentage: 16 },
        { day: 'Fri', percentage: 15 }
      ],
      lastUpdated: new Date()
    },
    {
      _id: 'tank-406',
      name: 'Tissa Wewa',
      district: 'Anuradhapura',
      location: 'Anuradhapura Sacred City',
      capacity: 350000,
      currentLevel: 217000,
      percentage: 62,
      status: 'NORMAL',
      nearbyVillages: ['Anuradhapura Town'],
      history: [
        { day: 'Mon', percentage: 68 },
        { day: 'Tue', percentage: 65 },
        { day: 'Wed', percentage: 63 },
        { day: 'Thu', percentage: 62 },
        { day: 'Fri', percentage: 62 }
      ],
      lastUpdated: new Date()
    },
    // Hambantota
    {
      _id: 'tank-407',
      name: 'Ridiyagama Reservoir',
      district: 'Hambantota',
      location: 'Ambalantota Sector',
      capacity: 600000,
      currentLevel: 72000,
      percentage: 12,
      status: 'CRITICAL',
      nearbyVillages: ['Suriyawewa', 'Ridiyagama'],
      history: [
        { day: 'Mon', percentage: 25 },
        { day: 'Tue', percentage: 20 },
        { day: 'Wed', percentage: 16 },
        { day: 'Thu', percentage: 13 },
        { day: 'Fri', percentage: 12 }
      ],
      lastUpdated: new Date()
    },
    // Puttalam
    {
      _id: 'tank-408',
      name: 'Tabbowa Tank',
      district: 'Puttalam',
      location: 'Anamaduwa Basin',
      capacity: 380000,
      currentLevel: 64600,
      percentage: 17,
      status: 'CRITICAL',
      nearbyVillages: ['Anamaduwa', 'Karuwalagaswewa'],
      history: [
        { day: 'Mon', percentage: 32 },
        { day: 'Tue', percentage: 26 },
        { day: 'Wed', percentage: 21 },
        { day: 'Thu', percentage: 18 },
        { day: 'Fri', percentage: 17 }
      ],
      lastUpdated: new Date()
    },
    // Batticaloa
    {
      _id: 'tank-409',
      name: 'Unnichchai Tank',
      district: 'Batticaloa',
      location: 'Manmunai West',
      capacity: 520000,
      currentLevel: 72800,
      percentage: 14,
      status: 'CRITICAL',
      nearbyVillages: ['Vavunathivu', 'Kokkadichcholai'],
      history: [
        { day: 'Mon', percentage: 29 },
        { day: 'Tue', percentage: 22 },
        { day: 'Wed', percentage: 18 },
        { day: 'Thu', percentage: 15 },
        { day: 'Fri', percentage: 14 }
      ],
      lastUpdated: new Date()
    },
    // Ampara
    {
      _id: 'tank-410',
      name: 'Senanayake Samudraya',
      district: 'Ampara',
      location: 'Inginiyagala',
      capacity: 1200000,
      currentLevel: 840000,
      percentage: 70,
      status: 'NORMAL',
      nearbyVillages: ['Ampara Town', 'Damana'],
      history: [
        { day: 'Mon', percentage: 75 },
        { day: 'Tue', percentage: 73 },
        { day: 'Wed', percentage: 71 },
        { day: 'Thu', percentage: 70 },
        { day: 'Fri', percentage: 70 }
      ],
      lastUpdated: new Date()
    }
  ],

  users: [
    { _id: 'usr-1', name: 'John Silva', email: 'resident@test.com', role: 'resident', village: 'Siripura', district: 'Polonnaruwa', status: 'Active' },
    { _id: 'usr-2', name: 'Kamal Perera', email: 'officer@test.com', role: 'officer', village: '—', district: 'Polonnaruwa', status: 'Active' },
    { _id: 'usr-3', name: 'Admin Master', email: 'admin@test.com', role: 'admin', village: '—', district: 'National', status: 'Active' },
    { _id: 'usr-4', name: 'Kithsiri Officer', email: 'officer.anu@test.com', role: 'officer', village: '—', district: 'Anuradhapura', status: 'Active' }
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
    console.log(`[Fallback] Server running in high-performance national dry zone memory store mode.`);
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, memoryStore, getMongoStatus };
