import { calculateStatus } from '../models/Tank.js';

let tanksStore = [];
let shortagesStore = [];
let deliveriesStore = [];

export const getDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

export const resetMemoryStore = () => {
  const now = new Date();
  
  tanksStore = [
    {
      _id: 'tank-1',
      name: 'Parakrama Samudraya',
      location: 'Thamankaduwa, Polonnaruwa',
      capacity: 134,
      currentLevel: 104.52,
      percentage: 78,
      status: 'NORMAL',
      thresholds: { normal: 70, low: 40, warning: 20 },
      lastUpdated: now,
      history: [
        { date: getDaysAgo(6), level: 96.48, percentage: 72, status: 'NORMAL' },
        { date: getDaysAgo(5), level: 99.16, percentage: 74, status: 'NORMAL' },
        { date: getDaysAgo(4), level: 100.5, percentage: 75, status: 'NORMAL' },
        { date: getDaysAgo(3), level: 101.84, percentage: 76, status: 'NORMAL' },
        { date: getDaysAgo(2), level: 103.18, percentage: 77, status: 'NORMAL' },
        { date: getDaysAgo(1), level: 104.52, percentage: 78, status: 'NORMAL' },
        { date: getDaysAgo(0), level: 104.52, percentage: 78, status: 'NORMAL' }
      ],
      nearbyVillages: [
        { name: 'Kaduruwela', riskLevel: 'NORMAL', distanceKm: 4.2, population: 14500 },
        { name: 'Jayanthipura', riskLevel: 'NORMAL', distanceKm: 6.8, population: 8200 },
        { name: 'Galamuna', riskLevel: 'NORMAL', distanceKm: 9.1, population: 5300 }
      ]
    },
    {
      _id: 'tank-2',
      name: 'Minneriya Tank',
      location: 'Hingurakgoda, Polonnaruwa',
      capacity: 135,
      currentLevel: 24.3,
      percentage: 18,
      status: 'CRITICAL',
      thresholds: { normal: 70, low: 40, warning: 20 },
      lastUpdated: now,
      history: [
        { date: getDaysAgo(6), level: 60.75, percentage: 45, status: 'LOW' },
        { date: getDaysAgo(5), level: 51.3, percentage: 38, status: 'WARNING' },
        { date: getDaysAgo(4), level: 43.2, percentage: 32, status: 'WARNING' },
        { date: getDaysAgo(3), level: 37.8, percentage: 28, status: 'WARNING' },
        { date: getDaysAgo(2), level: 29.7, percentage: 22, status: 'WARNING' },
        { date: getDaysAgo(1), level: 25.65, percentage: 19, status: 'CRITICAL' },
        { date: getDaysAgo(0), level: 24.3, percentage: 18, status: 'CRITICAL' }
      ],
      nearbyVillages: [
        { name: 'Siripura', riskLevel: 'CRITICAL', distanceKm: 3.5, population: 6400 },
        { name: 'Bakamuna', riskLevel: 'WARNING', distanceKm: 8.2, population: 9100 },
        { name: 'Welikanda', riskLevel: 'WARNING', distanceKm: 12.0, population: 11200 }
      ]
    },
    {
      _id: 'tank-3',
      name: 'Kaudulla Tank',
      location: 'Medirigiriya, Polonnaruwa',
      capacity: 128,
      currentLevel: 79.36,
      percentage: 62,
      status: 'LOW',
      thresholds: { normal: 70, low: 40, warning: 20 },
      lastUpdated: now,
      history: [
        { date: getDaysAgo(6), level: 87.04, percentage: 68, status: 'LOW' },
        { date: getDaysAgo(5), level: 84.48, percentage: 66, status: 'LOW' },
        { date: getDaysAgo(4), level: 83.2, percentage: 65, status: 'LOW' },
        { date: getDaysAgo(3), level: 81.92, percentage: 64, status: 'LOW' },
        { date: getDaysAgo(2), level: 80.64, percentage: 63, status: 'LOW' },
        { date: getDaysAgo(1), level: 79.36, percentage: 62, status: 'LOW' },
        { date: getDaysAgo(0), level: 79.36, percentage: 62, status: 'LOW' }
      ],
      nearbyVillages: [
        { name: 'Medirigiriya Town', riskLevel: 'LOW', distanceKm: 5.0, population: 12800 },
        { name: 'Meegaswewa', riskLevel: 'LOW', distanceKm: 7.4, population: 4900 },
        { name: 'Diwulankadawala', riskLevel: 'NORMAL', distanceKm: 11.2, population: 7100 }
      ]
    },
    {
      _id: 'tank-4',
      name: 'Giritale Tank',
      location: 'Giritale, Polonnaruwa',
      capacity: 24,
      currentLevel: 10.8,
      percentage: 45,
      status: 'LOW',
      thresholds: { normal: 70, low: 40, warning: 20 },
      lastUpdated: now,
      history: [
        { date: getDaysAgo(6), level: 13.2, percentage: 55, status: 'LOW' },
        { date: getDaysAgo(5), level: 12.48, percentage: 52, status: 'LOW' },
        { date: getDaysAgo(4), level: 12.0, percentage: 50, status: 'LOW' },
        { date: getDaysAgo(3), level: 11.52, percentage: 48, status: 'LOW' },
        { date: getDaysAgo(2), level: 11.04, percentage: 46, status: 'LOW' },
        { date: getDaysAgo(1), level: 10.8, percentage: 45, status: 'LOW' },
        { date: getDaysAgo(0), level: 10.8, percentage: 45, status: 'LOW' }
      ],
      nearbyVillages: [
        { name: 'Giritale Colony', riskLevel: 'LOW', distanceKm: 2.1, population: 3800 },
        { name: 'Minneriya South', riskLevel: 'WARNING', distanceKm: 6.5, population: 5900 }
      ]
    }
  ];

  shortagesStore = [
    { _id: 'short-1', village: 'Siripura', reporter: 'Gramaka Niladhari', severity: 'CRITICAL', status: 'OPEN', description: 'Drinking water wells completely dry' },
    { _id: 'short-2', village: 'Siripura', reporter: 'Resident (K. Bandara)', severity: 'HIGH', status: 'ASSIGNED', description: 'School tank depleted' },
    { _id: 'short-3', village: 'Bakamuna', reporter: 'Farmer Association', severity: 'HIGH', status: 'OPEN', description: 'Irrigation stream cut off' },
    { _id: 'short-4', village: 'Bakamuna', reporter: 'Clinic Director', severity: 'CRITICAL', status: 'ASSIGNED', description: 'Medical center low storage' },
    { _id: 'short-5', village: 'Welikanda', reporter: 'Community Leader', severity: 'MEDIUM', status: 'OPEN', description: 'High salinity in tap supply' },
    { _id: 'short-6', village: 'Minneriya South', reporter: 'Resident', severity: 'MEDIUM', status: 'OPEN', description: 'Low pressure water lines' },
    { _id: 'short-7', village: 'Meegaswewa', reporter: 'Resident', severity: 'LOW', status: 'OPEN', description: 'Scheduled rationing notice needed' },
    { _id: 'short-8', village: 'Giritale Colony', reporter: 'Resident', severity: 'LOW', status: 'OPEN', description: 'Filtering pump maintenance required' }
  ];

  deliveriesStore = [
    { bowserId: 'BW-102', driverName: 'Sunil Perera', targetVillage: 'Siripura Central', capacityLiters: 10000, status: 'IN_TRANSIT', scheduledTime: now },
    { bowserId: 'BW-105', driverName: 'K. Jayawardena', targetVillage: 'Siripura North', capacityLiters: 8000, status: 'SCHEDULED', scheduledTime: new Date(now.getTime() + 3600000) },
    { bowserId: 'BW-201', driverName: 'Nimal Silva', targetVillage: 'Bakamuna Hospital', capacityLiters: 12000, status: 'SCHEDULED', scheduledTime: new Date(now.getTime() + 7200000) },
    { bowserId: 'BW-204', driverName: 'A. Fernando', targetVillage: 'Welikanda School', capacityLiters: 6000, status: 'SCHEDULED', scheduledTime: new Date(now.getTime() + 10800000) },
    { bowserId: 'BW-308', driverName: 'R. Rathnayake', targetVillage: 'Minneriya South', capacityLiters: 8000, status: 'SCHEDULED', scheduledTime: new Date(now.getTime() + 14400000) }
  ];

  return tanksStore;
};

// Initialize
resetMemoryStore();

export const memoryStore = {
  getTanks: () => tanksStore,
  getTankById: (id) => tanksStore.find(t => t._id === id || t.name.toLowerCase().includes(id.toLowerCase())),
  patchLevel: (id, { currentLevel, percentage }) => {
    const tank = memoryStore.getTankById(id);
    if (!tank) return null;

    let newPercentage = tank.percentage;
    let newLevel = tank.currentLevel;

    if (percentage !== undefined) {
      newPercentage = Number(percentage);
      newLevel = Number(((newPercentage / 100) * tank.capacity).toFixed(2));
    } else if (currentLevel !== undefined) {
      newLevel = Number(currentLevel);
      newPercentage = Math.round((newLevel / tank.capacity) * 100);
    }

    tank.currentLevel = newLevel;
    tank.percentage = newPercentage;
    tank.status = calculateStatus(newPercentage, tank.thresholds);
    tank.lastUpdated = new Date();

    // Update village risk status
    if (tank.nearbyVillages) {
      tank.nearbyVillages.forEach((v, index) => {
        if (tank.status === 'CRITICAL') {
          v.riskLevel = index === 0 ? 'CRITICAL' : 'WARNING';
        } else if (tank.status === 'WARNING') {
          v.riskLevel = index === 0 ? 'WARNING' : 'LOW';
        } else if (tank.status === 'LOW') {
          v.riskLevel = 'LOW';
        } else {
          v.riskLevel = 'NORMAL';
        }
      });
    }

    // Append to history
    tank.history.push({
      date: new Date(),
      level: newLevel,
      percentage: newPercentage,
      status: tank.status
    });

    if (tank.history.length > 30) {
      tank.history = tank.history.slice(-30);
    }

    return tank;
  },
  getAlerts: () => {
    const alertTanks = tanksStore.filter(t => ['CRITICAL', 'WARNING', 'LOW'].includes(t.status));
    return {
      totalAlerts: alertTanks.length,
      criticalCount: alertTanks.filter(t => t.status === 'CRITICAL').length,
      warningCount: alertTanks.filter(t => t.status === 'WARNING').length,
      lowCount: alertTanks.filter(t => t.status === 'LOW').length,
      tanks: alertTanks
    };
  },
  getSummary: () => {
    const criticalTanksList = tanksStore.filter(t => t.status === 'CRITICAL');
    const warningTanksList = tanksStore.filter(t => t.status === 'WARNING');
    const lowTanksList = tanksStore.filter(t => t.status === 'LOW');

    const criticalVillages = [];
    tanksStore.forEach(t => {
      if (t.nearbyVillages) {
        t.nearbyVillages.forEach(v => {
          if (v.riskLevel === 'CRITICAL' || v.riskLevel === 'WARNING') {
            criticalVillages.push({
              name: v.name,
              riskLevel: v.riskLevel,
              tankName: t.name,
              tankStatus: t.status,
              population: v.population
            });
          }
        });
      }
    });

    return {
      systemName: 'WATERWATCH COMMAND CENTER - POLONNARUWA',
      tanksMonitored: tanksStore.length,
      criticalTanks: criticalTanksList.length,
      lowTanks: lowTanksList.length + warningTanksList.length,
      activeShortages: shortagesStore.length,
      scheduledDeliveries: deliveriesStore.length,
      criticalVillages,
      criticalTanksList,
      todayDeliveries: deliveriesStore,
      latestShortageReports: shortagesStore,
      lastRefreshed: new Date()
    };
  },
  reset: resetMemoryStore
};
