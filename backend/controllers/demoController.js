const { getMemoryStore, getDBMode } = require('../config/db');
const ShortageReport = require('../models/ShortageReport');
const Tank = require('../models/Tank');
const Bowser = require('../models/Bowser');
const {
  initialShortageReports,
  initialTanks,
  initialBowsers,
  initialDeliveryLogs,
  initialResidentNotifications
} = require('../data/seedData');

/**
 * POST /api/demo/reset
 * Resets data to initial hackathon demo scenario
 */
async function resetDemo(req, res) {
  try {
    if (getDBMode() === 'mongodb') {
      await ShortageReport.deleteMany({});
      await Tank.deleteMany({});
      await Bowser.deleteMany({});
      await ShortageReport.insertMany(initialShortageReports);
      await Tank.insertMany(initialTanks);
      await Bowser.insertMany(initialBowsers);
    } else {
      const store = getMemoryStore();
      store.reset();
    }

    return res.status(200).json({
      success: true,
      message: 'Demo scenario reset to official baseline (Siripura, Bakamuna, Welikanda, Medirigiriya, Dimbulagala).'
    });
  } catch (error) {
    console.error('Error resetting demo scenario:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset demo scenario',
      error: error.message
    });
  }
}

/**
 * POST /api/demo/update-shortage
 * Allows dynamic adjustment of shortage report parameters to simulate real-time emergency evolution
 */
async function updateShortage(req, res) {
  try {
    const { villageId, daysWithoutWater, affectedPeople, tankLevelPercentage, daysSinceLastDelivery, alternativeWaterSource } = req.body;

    if (!villageId) {
      return res.status(400).json({ success: false, message: 'villageId is required' });
    }

    const updateFields = {};
    if (daysWithoutWater !== undefined) updateFields.daysWithoutWater = Number(daysWithoutWater);
    if (affectedPeople !== undefined) updateFields.affectedPeople = Number(affectedPeople);
    if (daysSinceLastDelivery !== undefined) updateFields.daysSinceLastDelivery = Number(daysSinceLastDelivery);
    if (alternativeWaterSource !== undefined) updateFields.alternativeWaterSource = alternativeWaterSource;

    await ShortageReport.updateReport(villageId, updateFields);

    // If tank level is provided, update Tank model too
    if (tankLevelPercentage !== undefined) {
      if (getDBMode() === 'mongodb') {
        await Tank.findOneAndUpdate({ villageId }, { $set: { waterLevelPercentage: Number(tankLevelPercentage) } });
      } else {
        const store = getMemoryStore();
        const tank = store.tanks.find(t => t.villageId === villageId);
        if (tank) {
          tank.waterLevelPercentage = Number(tankLevelPercentage);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Updated parameters for village ${villageId}`
    });
  } catch (error) {
    console.error('Error updating shortage:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update shortage parameters',
      error: error.message
    });
  }
}

module.exports = {
  resetDemo,
  updateShortage
};
