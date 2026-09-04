import Tank from '../models/Tank.js';
import { Shortage, Delivery } from '../models/Shortage.js';

export const seedDatabase = async () => {
  try {
    await Tank.deleteMany({});
    await Shortage.deleteMany({});
    await Delivery.deleteMany({});

    const now = new Date();
    const daysAgo = (days) => {
      const d = new Date(now);
      d.setDate(d.getDate() - days);
      return d;
    };

    const tanksData = [
      {
        name: 'Parakrama Samudraya',
        location: 'Thamankaduwa, Polonnaruwa',
        capacity: 134, // MCM
        currentLevel: 104.56, // ~78%
        percentage: 78,
        status: 'NORMAL',
        thresholds: { normal: 70, low: 40, warning: 20 },
        lastUpdated: now,
        history: [
          { date: daysAgo(6), level: 96.48, percentage: 72, status: 'NORMAL' },
          { date: daysAgo(5), level: 99.16, percentage: 74, status: 'NORMAL' },
          { date: daysAgo(4), level: 100.5, percentage: 75, status: 'NORMAL' },
          { date: daysAgo(3), level: 101.84, percentage: 76, status: 'NORMAL' },
          { date: daysAgo(2), level: 103.18, percentage: 77, status: 'NORMAL' },
          { date: daysAgo(1), level: 104.56, percentage: 78, status: 'NORMAL' },
          { date: daysAgo(0), level: 104.56, percentage: 78, status: 'NORMAL' }
        ],
        nearbyVillages: [
          { name: 'Kaduruwela', riskLevel: 'NORMAL', distanceKm: 4.2, population: 14500 },
          { name: 'Jayanthipura', riskLevel: 'NORMAL', distanceKm: 6.8, population: 8200 },
          { name: 'Galamuna', riskLevel: 'NORMAL', distanceKm: 9.1, population: 5300 }
        ]
      },
      {
        name: 'Minneriya Tank',
        location: 'Hingurakgoda, Polonnaruwa',
        capacity: 135, // MCM
        currentLevel: 24.3, // 18%
        percentage: 18,
        status: 'CRITICAL',
        thresholds: { normal: 70, low: 40, warning: 20 },
        lastUpdated: now,
        history: [
          { date: daysAgo(6), level: 60.75, percentage: 45, status: 'LOW' },
          { date: daysAgo(5), level: 51.3, percentage: 38, status: 'WARNING' },
          { date: daysAgo(4), level: 43.2, percentage: 32, status: 'WARNING' },
          { date: daysAgo(3), level: 37.8, percentage: 28, status: 'WARNING' },
          { date: daysAgo(2), level: 29.7, percentage: 22, status: 'WARNING' },
          { date: daysAgo(1), level: 25.65, percentage: 19, status: 'CRITICAL' },
          { date: daysAgo(0), level: 24.3, percentage: 18, status: 'CRITICAL' }
        ],
        nearbyVillages: [
          { name: 'Siripura', riskLevel: 'CRITICAL', distanceKm: 3.5, population: 6400 },
          { name: 'Bakamuna', riskLevel: 'WARNING', distanceKm: 8.2, population: 9100 },
          { name: 'Welikanda', riskLevel: 'WARNING', distanceKm: 12.0, population: 11200 }
        ]
      },
      {
        name: 'Kaudulla Tank',
        location: 'Medirigiriya, Polonnaruwa',
        capacity: 128, // MCM
        currentLevel: 79.36, // ~62%
        percentage: 62,
        status: 'LOW',
        thresholds: { normal: 70, low: 40, warning: 20 },
        lastUpdated: now,
        history: [
          { date: daysAgo(6), level: 87.04, percentage: 68, status: 'LOW' },
          { date: daysAgo(5), level: 84.48, percentage: 66, status: 'LOW' },
          { date: daysAgo(4), level: 83.2, percentage: 65, status: 'LOW' },
          { date: daysAgo(3), level: 81.92, percentage: 64, status: 'LOW' },
          { date: daysAgo(2), level: 80.64, percentage: 63, status: 'LOW' },
          { date: daysAgo(1), level: 79.36, percentage: 62, status: 'LOW' },
          { date: daysAgo(0), level: 79.36, percentage: 62, status: 'LOW' }
        ],
        nearbyVillages: [
          { name: 'Medirigiriya Town', riskLevel: 'LOW', distanceKm: 5.0, population: 12800 },
          { name: 'Meegaswewa', riskLevel: 'LOW', distanceKm: 7.4, population: 4900 },
          { name: 'Diwulankadawala', riskLevel: 'NORMAL', distanceKm: 11.2, population: 7100 }
        ]
      },
      {
        name: 'Giritale Tank',
        location: 'Giritale, Polonnaruwa',
        capacity: 24, // MCM
        currentLevel: 10.8, // 45%
        percentage: 45,
        status: 'LOW',
        thresholds: { normal: 70, low: 40, warning: 20 },
        lastUpdated: now,
        history: [
          { date: daysAgo(6), level: 13.2, percentage: 55, status: 'LOW' },
          { date: daysAgo(5), level: 12.48, percentage: 52, status: 'LOW' },
          { date: daysAgo(4), level: 12.0, percentage: 50, status: 'LOW' },
          { date: daysAgo(3), level: 11.52, percentage: 48, status: 'LOW' },
          { date: daysAgo(2), level: 11.04, percentage: 46, status: 'LOW' },
          { date: daysAgo(1), level: 10.8, percentage: 45, status: 'LOW' },
          { date: daysAgo(0), level: 10.8, percentage: 45, status: 'LOW' }
        ],
        nearbyVillages: [
          { name: 'Giritale Colony', riskLevel: 'LOW', distanceKm: 2.1, population: 3800 },
          { name: 'Minneriya South', riskLevel: 'WARNING', distanceKm: 6.5, population: 5900 }
        ]
      }
    ];

    const insertedTanks = await Tank.insertMany(tanksData);

    // Seed mock shortages (8 active shortages)
    const shortagesData = [
      { village: 'Siripura', reporter: 'Gramaka Niladhari', severity: 'CRITICAL', status: 'OPEN', description: 'Drinking water wells completely dry' },
      { village: 'Siripura', reporter: 'Resident (K. Bandara)', severity: 'HIGH', status: 'ASSIGNED', description: 'School tank depleted' },
      { village: 'Bakamuna', reporter: 'Farmer Association', severity: 'HIGH', status: 'OPEN', description: 'Irrigation stream cut off' },
      { village: 'Bakamuna', reporter: 'Clinic Director', severity: 'CRITICAL', status: 'ASSIGNED', description: 'Medical center low storage' },
      { village: 'Welikanda', reporter: 'Community Leader', severity: 'MEDIUM', status: 'OPEN', description: 'High salinity in tap supply' },
      { village: 'Minneriya South', reporter: 'Resident', severity: 'MEDIUM', status: 'OPEN', description: 'Low pressure water lines' },
      { village: 'Meegaswewa', reporter: 'Resident', severity: 'LOW', status: 'OPEN', description: 'Scheduled rationing notice needed' },
      { village: 'Giritale Colony', reporter: 'Resident', severity: 'LOW', status: 'OPEN', description: 'Filtering pump maintenance required' }
    ];
    await Shortage.insertMany(shortagesData);

    // Seed mock deliveries (5 scheduled deliveries)
    const deliveriesData = [
      { bowserId: 'BW-102', driverName: 'Sunil Perera', targetVillage: 'Siripura Central', capacityLiters: 10000, status: 'IN_TRANSIT', scheduledTime: now },
      { bowserId: 'BW-105', driverName: 'K. Jayawardena', targetVillage: 'Siripura North', capacityLiters: 8000, status: 'SCHEDULED', scheduledTime: new Date(now.getTime() + 3600000) },
      { bowserId: 'BW-201', driverName: 'Nimal Silva', targetVillage: 'Bakamuna Hospital', capacityLiters: 12000, status: 'SCHEDULED', scheduledTime: new Date(now.getTime() + 7200000) },
      { bowserId: 'BW-204', driverName: 'A. Fernando', targetVillage: 'Welikanda School', capacityLiters: 6000, status: 'SCHEDULED', scheduledTime: new Date(now.getTime() + 10800000) },
      { bowserId: 'BW-308', driverName: 'R. Rathnayake', targetVillage: 'Minneriya South', capacityLiters: 8000, status: 'SCHEDULED', scheduledTime: new Date(now.getTime() + 14400000) }
    ];
    await Delivery.insertMany(deliveriesData);

    console.log('[Seed] Database seeded with 4 tanks, 8 shortages, and 5 deliveries.');
    return insertedTanks;
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    throw error;
  }
};
