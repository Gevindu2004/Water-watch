const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bowser = require('./models/Bowser');
const Delivery = require('./models/Delivery');

dotenv.config();

const sampleBowsers = [
  {
    bowserId: 'WB-102',
    registrationNumber: 'WP CP-4821',
    capacity: 5000,
    currentLocation: 'Polonnaruwa Depot',
    status: 'Available',
    driverName: 'Sarath Kumara',
    driverContact: '+94 77 123 4567'
  },
  {
    bowserId: 'WB-105',
    registrationNumber: 'WP CP-5102',
    capacity: 5000,
    currentLocation: 'Bakamuna Junction',
    status: 'On The Way',
    driverName: 'Nimal Perera',
    driverContact: '+94 71 987 6543'
  },
  {
    bowserId: 'WB-108',
    registrationNumber: 'NC GA-8819',
    capacity: 3000,
    currentLocation: 'Welikanda Center',
    status: 'Completed',
    driverName: 'Kamal Silva',
    driverContact: '+94 76 555 1234'
  },
  {
    bowserId: 'WB-112',
    registrationNumber: 'NC GB-3410',
    capacity: 6000,
    currentLocation: 'Hingurakgoda Water Board',
    status: 'Available',
    driverName: 'Sunil Jayasinghe',
    driverContact: '+94 70 333 4455'
  }
];

const sampleDeliveries = [
  {
    bowserId: 'WB-102',
    villageId: 'Siripura',
    distributionPoint: 'Siripura Temple Junction',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedArrival: '2:00 PM',
    capacity: 5000,
    status: 'Scheduled',
    peopleWaiting: 86
  },
  {
    bowserId: 'WB-105',
    villageId: 'Bakamuna',
    distributionPoint: 'Bakamuna Maha Vidyalaya Grounds',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedArrival: '3:30 PM',
    capacity: 5000,
    status: 'On The Way',
    peopleWaiting: 120
  },
  {
    bowserId: 'WB-108',
    villageId: 'Welikanda',
    distributionPoint: 'Welikanda Divisional Secretariat',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedArrival: '5:00 PM',
    capacity: 3000,
    status: 'Completed',
    peopleWaiting: 45
  }
];

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/waterwatch';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    await Bowser.deleteMany({});
    await Delivery.deleteMany({});

    await Bowser.insertMany(sampleBowsers);
    await Delivery.insertMany(sampleDeliveries);

    console.log('✅ Demo scenario data successfully seeded to MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed or MongoDB not running locally:', error.message);
    console.log('ℹ️ In-memory fallback will automatically supply pre-loaded demo data.');
    process.exit(1);
  }
};

seedData();
