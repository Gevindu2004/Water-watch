const Bowser = require('../models/Bowser');
const { dispatchBowser, getResidentNotifications } = require('../services/notificationService');

/**
 * GET /api/bowsers
 * Retrieves all registered bowsers and their real-time statuses
 */
async function getBowsers(req, res) {
  try {
    const bowsers = await Bowser.findBowsers();
    return res.status(200).json({
      success: true,
      bowsers
    });
  } catch (error) {
    console.error('Error fetching bowsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bowsers',
      error: error.message
    });
  }
}

/**
 * POST /api/bowsers/dispatch
 * Official decision approval action: dispatches bowser and notifies residents
 */
async function dispatch(req, res) {
  try {
    const { villageId, villageName, bowserId, capacity, approvedBy, targetEta } = req.body;

    if (!villageId || !villageName || !bowserId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: villageId, villageName, and bowserId are mandatory.'
      });
    }

    const result = await dispatchBowser({
      villageId,
      villageName,
      bowserId,
      capacity: Number(capacity) || 5000,
      approvedBy: approvedBy || 'Regional Water Officer',
      targetEta: targetEta || '2:15 PM'
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error dispatching bowser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to execute dispatch action',
      error: error.message
    });
  }
}

/**
 * GET /api/notifications/resident-feed
 * Returns simulated resident alert feeds
 */
async function getResidentFeed(req, res) {
  try {
    const { villageId } = req.query;
    const notifications = await getResidentNotifications(villageId);
    return res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error fetching resident feed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve resident notifications',
      error: error.message
    });
  }
}

module.exports = {
  getBowsers,
  dispatch,
  getResidentFeed
};
