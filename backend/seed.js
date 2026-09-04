require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Village = require('./models/Village');
const WaterReport = require('./models/WaterReport');
const Delivery = require('./models/Delivery');

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Village.deleteMany();
    await WaterReport.deleteMany();
    await Delivery.deleteMany();

    // Create Villages
    const villages = await Village.insertMany([
      { name: 'Siripura', currentWaterStatus: 'Critical', daysWithoutWater: 3, affectedPopulation: 120, tankLevel: 18, lastWaterReceived: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { name: 'Bakamuna', currentWaterStatus: 'Warning', daysWithoutWater: 2, affectedPopulation: 80, tankLevel: 25, lastWaterReceived: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { name: 'Welikanda', currentWaterStatus: 'Normal', daysWithoutWater: 1, affectedPopulation: 200, tankLevel: 42, lastWaterReceived: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { name: 'Medirigiriya', currentWaterStatus: 'Warning', daysWithoutWater: 4, affectedPopulation: 60, tankLevel: 35, lastWaterReceived: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { name: 'Hingurakgoda', currentWaterStatus: 'Normal', daysWithoutWater: 0, affectedPopulation: 0, tankLevel: 75, lastWaterReceived: new Date() }
    ]);

    const siripura = villages[0];

    // Create a Delivery for Siripura (Today, slightly in the future)
    const expectedArrival = new Date();
    expectedArrival.setHours(expectedArrival.getHours() + 2); // 2 hours from now

    await Delivery.create({
      village: siripura._id,
      bowserId: 'WB-102',
      capacity: 5000,
      expectedArrival: expectedArrival,
      distributionPoint: 'Siripura Community Hall',
      peopleWaiting: 86,
      status: 'On the way'
    });

    // Create an initial Water Report
    await WaterReport.create({
      village: siripura._id,
      waterAvailable: false,
      lastReceivedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      peopleAffected: 120,
      description: 'Tank completely dry',
      status: 'Verified',
      priority: 'Critical'
    });

    console.log('Data Seeded!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
