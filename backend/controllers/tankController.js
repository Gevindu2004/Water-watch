import Tank, { calculateStatus } from '../models/Tank.js';
import { isInMemory } from '../config/db.js';
import { memoryStore } from '../utils/memoryStore.js';
import { seedDatabase } from '../utils/seedData.js';

// GET /api/tanks
export const getAllTanks = async (req, res) => {
  try {
    if (isInMemory) {
      return res.json(memoryStore.getTanks());
    }
    let tanks = await Tank.find().sort({ percentage: 1 });
    if (tanks.length === 0) {
      await seedDatabase();
      tanks = await Tank.find().sort({ percentage: 1 });
    }
    res.json(tanks);
  } catch (error) {
    // Fallback to memoryStore on database exception
    res.json(memoryStore.getTanks());
  }
};

// GET /api/tanks/:id
export const getTankById = async (req, res) => {
  try {
    if (isInMemory) {
      const tank = memoryStore.getTankById(req.params.id);
      if (!tank) return res.status(404).json({ error: 'Tank not found' });
      return res.json(tank);
    }
    const tank = await Tank.findById(req.params.id);
    if (!tank) return res.status(404).json({ error: 'Tank not found' });
    res.json(tank);
  } catch (error) {
    const memTank = memoryStore.getTankById(req.params.id);
    if (memTank) return res.json(memTank);
    res.status(500).json({ error: 'Failed to fetch tank', details: error.message });
  }
};

// POST /api/tanks
export const createTank = async (req, res) => {
  try {
    const { name, location, capacity, currentLevel, thresholds, nearbyVillages } = req.body;
    const initialPercentage = Math.round((currentLevel / capacity) * 100);
    const initialStatus = calculateStatus(initialPercentage, thresholds);

    if (isInMemory) {
      const newTank = {
        _id: `tank-${Date.now()}`,
        name,
        location,
        capacity,
        currentLevel,
        percentage: initialPercentage,
        status: initialStatus,
        thresholds: thresholds || { normal: 70, low: 40, warning: 20 },
        nearbyVillages: nearbyVillages || [],
        history: [{ date: new Date(), level: currentLevel, percentage: initialPercentage, status: initialStatus }]
      };
      memoryStore.getTanks().push(newTank);
      return res.status(201).json(newTank);
    }

    const newTank = new Tank({
      name,
      location,
      capacity,
      currentLevel,
      percentage: initialPercentage,
      status: initialStatus,
      thresholds: thresholds || { normal: 70, low: 40, warning: 20 },
      nearbyVillages: nearbyVillages || [],
      history: [{ date: new Date(), level: currentLevel, percentage: initialPercentage, status: initialStatus }]
    });

    const savedTank = await newTank.save();
    res.status(201).json(savedTank);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create tank', details: error.message });
  }
};

// PUT /api/tanks/:id
export const updateTank = async (req, res) => {
  try {
    if (isInMemory) {
      const tank = memoryStore.getTankById(req.params.id);
      if (!tank) return res.status(404).json({ error: 'Tank not found' });
      Object.assign(tank, req.body);
      return res.json(tank);
    }
    const tank = await Tank.findById(req.params.id);
    if (!tank) return res.status(404).json({ error: 'Tank not found' });

    Object.assign(tank, req.body);
    const updated = await tank.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update tank', details: error.message });
  }
};

// PATCH /api/tanks/:id/level
export const updateTankLevel = async (req, res) => {
  try {
    if (isInMemory) {
      const updated = memoryStore.patchLevel(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Tank not found' });
      return res.json(updated);
    }

    const tank = await Tank.findById(req.params.id);
    if (!tank) return res.status(404).json({ error: 'Tank not found' });

    const { currentLevel, percentage } = req.body;
    let newLevel = tank.currentLevel;
    let newPercentage = tank.percentage;

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

    if (tank.nearbyVillages && tank.nearbyVillages.length > 0) {
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

    tank.history.push({
      date: new Date(),
      level: newLevel,
      percentage: newPercentage,
      status: tank.status
    });

    if (tank.history.length > 30) {
      tank.history = tank.history.slice(-30);
    }

    const updated = await tank.save();
    res.json(updated);
  } catch (error) {
    const updated = memoryStore.patchLevel(req.params.id, req.body);
    if (updated) return res.json(updated);
    res.status(400).json({ error: 'Failed to patch tank level', details: error.message });
  }
};

// GET /api/tanks/:id/history
export const getTankHistory = async (req, res) => {
  try {
    if (isInMemory) {
      const tank = memoryStore.getTankById(req.params.id);
      if (!tank) return res.status(404).json({ error: 'Tank not found' });
      return res.json({ tankId: tank._id, name: tank.name, currentPercentage: tank.percentage, history: tank.history });
    }
    const tank = await Tank.findById(req.params.id);
    if (!tank) return res.status(404).json({ error: 'Tank not found' });
    res.json({ tankId: tank._id, name: tank.name, currentPercentage: tank.percentage, history: tank.history });
  } catch (error) {
    const memTank = memoryStore.getTankById(req.params.id);
    if (memTank) return res.json({ tankId: memTank._id, name: memTank.name, currentPercentage: memTank.percentage, history: memTank.history });
    res.status(500).json({ error: 'Failed to fetch tank history', details: error.message });
  }
};

// GET /api/tanks/alerts
export const getTankAlerts = async (req, res) => {
  try {
    if (isInMemory) {
      return res.json(memoryStore.getAlerts());
    }
    const alertTanks = await Tank.find({
      status: { $in: ['CRITICAL', 'WARNING', 'LOW'] }
    }).sort({ percentage: 1 });

    res.json({
      totalAlerts: alertTanks.length,
      criticalCount: alertTanks.filter(t => t.status === 'CRITICAL').length,
      warningCount: alertTanks.filter(t => t.status === 'WARNING').length,
      lowCount: alertTanks.filter(t => t.status === 'LOW').length,
      tanks: alertTanks
    });
  } catch (error) {
    res.json(memoryStore.getAlerts());
  }
};

// POST /api/tanks/seed
export const seedTanksData = async (req, res) => {
  try {
    if (isInMemory) {
      const tanks = memoryStore.reset();
      return res.json({ message: 'Memory store reset to default seed', count: tanks.length, tanks });
    }
    const seeded = await seedDatabase();
    res.json({ message: 'Database seeded successfully', count: seeded.length, tanks: seeded });
  } catch (error) {
    const tanks = memoryStore.reset();
    res.json({ message: 'Memory store reset fallback executed', count: tanks.length, tanks });
  }
};
