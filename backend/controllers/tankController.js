const Tank = require('../models/Tank');
const { getMongoStatus, memoryStore } = require('../config/db');

// Helper to determine status from percentage
const calculateStatus = (pct) => {
  if (pct >= 70) return 'NORMAL';
  if (pct >= 40) return 'LOW';
  if (pct >= 20) return 'WARNING';
  return 'CRITICAL';
};

// @desc    Get all tanks
// @route   GET /api/tanks
const getAllTanks = async (req, res, next) => {
  try {
    const { district } = req.query;
    if (getMongoStatus()) {
      const filter = (district && district !== 'All') ? { district } : {};
      const tanks = await Tank.find(filter).sort({ percentage: 1 });
      return res.status(200).json({ success: true, count: tanks.length, data: tanks, tanks });
    } else {
      let tanks = memoryStore.tanks;
      if (district && district !== 'All') {
        tanks = tanks.filter(t => t.district === district);
      }
      return res.status(200).json({ success: true, count: tanks.length, data: tanks, tanks });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get tank alerts (Critical & Low tanks)
// @route   GET /api/tanks/alerts
const getTankAlerts = async (req, res, next) => {
  try {
    const { district } = req.query;
    if (getMongoStatus()) {
      const filter = { status: { $in: ['CRITICAL', 'WARNING', 'LOW'] } };
      if (district && district !== 'All') filter.district = district;
      const alerts = await Tank.find(filter);
      return res.status(200).json({ success: true, count: alerts.length, data: alerts, alerts });
    } else {
      let alerts = memoryStore.tanks.filter(t => t.status === 'CRITICAL' || t.status === 'WARNING' || t.status === 'LOW');
      if (district && district !== 'All') {
        alerts = alerts.filter(t => t.district === district);
      }
      return res.status(200).json({ success: true, count: alerts.length, data: alerts, alerts });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tank by ID
// @route   GET /api/tanks/:id
const getTankById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getMongoStatus()) {
      const tank = await Tank.findById(id);
      if (!tank) return res.status(404).json({ success: false, message: `Tank ${id} not found` });
      return res.status(200).json({ success: true, data: tank });
    } else {
      const tank = memoryStore.tanks.find(t => t._id === id || t.name.toLowerCase() === id.toLowerCase());
      if (!tank) return res.status(404).json({ success: false, message: `Tank ${id} not found` });
      return res.status(200).json({ success: true, data: tank });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new tank
// @route   POST /api/tanks
const createTank = async (req, res, next) => {
  try {
    const { name, location, capacity, currentLevel, nearbyVillages } = req.body;
    const levelVal = Number(currentLevel) || 0;
    const capVal = Number(capacity) || 500000;
    const pct = Math.round((levelVal / capVal) * 100);
    const status = calculateStatus(pct);

    if (getMongoStatus()) {
      const tank = await Tank.create({
        name,
        location,
        capacity: capVal,
        currentLevel: levelVal,
        percentage: pct,
        status,
        nearbyVillages: nearbyVillages || []
      });
      return res.status(201).json({ success: true, data: tank });
    } else {
      const newTank = {
        _id: 'tank-' + Date.now(),
        name,
        location,
        capacity: capVal,
        currentLevel: levelVal,
        percentage: pct,
        status,
        history: [
          { day: 'Mon', percentage: pct + 10 },
          { day: 'Tue', percentage: pct + 5 },
          { day: 'Wed', percentage: pct },
          { day: 'Thu', percentage: pct }
        ],
        nearbyVillages: nearbyVillages || [],
        lastUpdated: new Date()
      };
      memoryStore.tanks.push(newTank);
      return res.status(201).json({ success: true, data: newTank });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update tank details
// @route   PUT /api/tanks/:id
const updateTank = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (getMongoStatus()) {
      const tank = await Tank.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!tank) return res.status(404).json({ success: false, message: `Tank ${id} not found` });
      return res.status(200).json({ success: true, data: tank });
    } else {
      const index = memoryStore.tanks.findIndex(t => t._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: `Tank ${id} not found` });
      memoryStore.tanks[index] = { ...memoryStore.tanks[index], ...updates };
      return res.status(200).json({ success: true, data: memoryStore.tanks[index] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update tank water level & status
// @route   PATCH /api/tanks/:id/level
const updateTankLevel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentLevel, percentage } = req.body;

    if (getMongoStatus()) {
      const tank = await Tank.findById(id);
      if (!tank) return res.status(404).json({ success: false, message: `Tank ${id} not found` });

      if (typeof percentage === 'number') {
        tank.percentage = percentage;
        tank.currentLevel = Math.round((percentage / 100) * tank.capacity);
      } else if (typeof currentLevel === 'number') {
        tank.currentLevel = currentLevel;
        tank.percentage = Math.round((currentLevel / tank.capacity) * 100);
      }

      tank.status = calculateStatus(tank.percentage);
      tank.lastUpdated = Date.now();
      await tank.save();

      return res.status(200).json({ success: true, data: tank });
    } else {
      const tank = memoryStore.tanks.find(t => t._id === id);
      if (!tank) return res.status(404).json({ success: false, message: `Tank ${id} not found` });

      if (typeof percentage === 'number') {
        tank.percentage = percentage;
        tank.currentLevel = Math.round((percentage / 100) * tank.capacity);
      } else if (typeof currentLevel === 'number') {
        tank.currentLevel = currentLevel;
        tank.percentage = Math.round((currentLevel / tank.capacity) * 100);
      }

      tank.status = calculateStatus(tank.percentage);
      tank.lastUpdated = new Date();

      return res.status(200).json({ success: true, data: tank });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get tank water level history (Recharts)
// @route   GET /api/tanks/:id/history
const getTankHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let tank;
    if (getMongoStatus()) {
      tank = await Tank.findById(id);
    } else {
      tank = memoryStore.tanks.find(t => t._id === id);
    }

    if (!tank) {
      return res.status(404).json({ success: false, message: `Tank ${id} not found` });
    }

    const defaultHistory = [
      { day: 'Mon', levelPct: tank.percentage + 12 },
      { day: 'Tue', levelPct: tank.percentage + 8 },
      { day: 'Wed', levelPct: tank.percentage + 4 },
      { day: 'Thu', levelPct: tank.percentage },
      { day: 'Fri', levelPct: tank.percentage - 2 },
      { day: 'Sat', levelPct: tank.percentage - 4 },
      { day: 'Sun', levelPct: tank.percentage }
    ];

    return res.status(200).json({
      success: true,
      tankName: tank.name,
      currentPercentage: tank.percentage,
      status: tank.status,
      history: tank.history && tank.history.length > 0 ? tank.history : defaultHistory
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTanks,
  getTankAlerts,
  getTankById,
  createTank,
  updateTank,
  updateTankLevel,
  getTankHistory
};
