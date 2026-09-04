import Tank from '../models/Tank.js';
import { Shortage, Delivery } from '../models/Shortage.js';
import { isInMemory } from '../config/db.js';
import { memoryStore } from '../utils/memoryStore.js';

// GET /api/dashboard/summary
export const getDashboardSummary = async (req, res) => {
  try {
    if (isInMemory) {
      return res.json(memoryStore.getSummary());
    }
    const tanks = await Tank.find();
    const shortages = await Shortage.find().sort({ reportedAt: -1 });
    const deliveries = await Delivery.find().sort({ scheduledTime: 1 });

    const tanksMonitored = tanks.length;
    const criticalTanksList = tanks.filter(t => t.status === 'CRITICAL');
    const warningTanksList = tanks.filter(t => t.status === 'WARNING');
    const lowTanksList = tanks.filter(t => t.status === 'LOW');

    const criticalTanks = criticalTanksList.length;
    const lowTanks = lowTanksList.length + warningTanksList.length;

    const criticalVillages = [];
    tanks.forEach(tank => {
      if (tank.nearbyVillages) {
        tank.nearbyVillages.forEach(v => {
          if (v.riskLevel === 'CRITICAL' || v.riskLevel === 'WARNING') {
            criticalVillages.push({
              name: v.name,
              riskLevel: v.riskLevel,
              tankName: tank.name,
              tankStatus: tank.status,
              population: v.population
            });
          }
        });
      }
    });

    res.json({
      systemName: 'WATERWATCH COMMAND CENTER - POLONNARUWA',
      tanksMonitored,
      criticalTanks,
      lowTanks,
      activeShortages: shortages.length,
      scheduledDeliveries: deliveries.length,
      criticalVillages,
      criticalTanksList,
      todayDeliveries: deliveries.slice(0, 5),
      latestShortageReports: shortages.slice(0, 5),
      lastRefreshed: new Date()
    });
  } catch (error) {
    res.json(memoryStore.getSummary());
  }
};
