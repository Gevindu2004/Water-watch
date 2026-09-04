const Bowser = require('../models/Bowser');
const { getMongoStatus, memoryStore } = require('../config/db');

// @desc    Get all bowsers
// @route   GET /api/bowsers
const getAllBowsers = async (req, res, next) => {
  try {
    if (getMongoStatus()) {
      const bowsers = await Bowser.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: bowsers.length, data: bowsers });
    } else {
      return res.status(200).json({ success: true, count: memoryStore.bowsers.length, data: memoryStore.bowsers });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new bowser
// @route   POST /api/bowsers
const createBowser = async (req, res, next) => {
  try {
    const { bowserId, registrationNumber, capacity, currentLocation, status, driverName, driverContact } = req.body;

    if (!bowserId || !registrationNumber || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bowserId, registrationNumber, and capacity'
      });
    }

    if (getMongoStatus()) {
      const existing = await Bowser.findOne({ bowserId: bowserId.toUpperCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: `Bowser ID ${bowserId} already exists.` });
      }

      const bowser = await Bowser.create({
        bowserId: bowserId.toUpperCase(),
        registrationNumber,
        capacity: Number(capacity),
        currentLocation: currentLocation || 'Polonnaruwa Central Depot',
        status: status || 'Available',
        driverName: driverName || 'Unassigned',
        driverContact: driverContact || 'N/A'
      });
      return res.status(201).json({ success: true, data: bowser });
    } else {
      const formattedId = bowserId.toUpperCase();
      const existing = memoryStore.bowsers.find(b => b.bowserId === formattedId);
      if (existing) {
        return res.status(400).json({ success: false, message: `Bowser ID ${formattedId} already exists.` });
      }

      const newBowser = {
        _id: 'bowser-' + Date.now(),
        bowserId: formattedId,
        registrationNumber,
        capacity: Number(capacity),
        currentLocation: currentLocation || 'Polonnaruwa Central Depot',
        status: status || 'Available',
        driverName: driverName || 'Unassigned',
        driverContact: driverContact || 'N/A',
        createdAt: new Date()
      };
      memoryStore.bowsers.unshift(newBowser);
      return res.status(201).json({ success: true, data: newBowser });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update bowser full details
// @route   PUT /api/bowsers/:id
const updateBowser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (getMongoStatus()) {
      let bowser;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        bowser = await Bowser.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      } else {
        bowser = await Bowser.findOneAndUpdate({ bowserId: id }, updates, { new: true, runValidators: true });
      }

      if (!bowser) {
        return res.status(404).json({ success: false, message: `Bowser with ID ${id} not found.` });
      }
      return res.status(200).json({ success: true, data: bowser });
    } else {
      const index = memoryStore.bowsers.findIndex(b => b._id === id || b.bowserId === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: `Bowser with ID ${id} not found.` });
      }
      memoryStore.bowsers[index] = { ...memoryStore.bowsers[index], ...updates };
      return res.status(200).json({ success: true, data: memoryStore.bowsers[index] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update bowser status
// @route   PATCH /api/bowsers/:id/status
const updateBowserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, currentLocation } = req.body;

    const validStatuses = ['Available', 'Assigned', 'On The Way', 'Distributing', 'Completed', 'Delayed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (getMongoStatus()) {
      let query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { bowserId: id };
      const updateData = {};
      if (status) updateData.status = status;
      if (currentLocation) updateData.currentLocation = currentLocation;

      const bowser = await Bowser.findOneAndUpdate(query, updateData, { new: true });
      if (!bowser) {
        return res.status(404).json({ success: false, message: `Bowser ${id} not found.` });
      }
      return res.status(200).json({ success: true, data: bowser });
    } else {
      const bowser = memoryStore.bowsers.find(b => b._id === id || b.bowserId === id);
      if (!bowser) {
        return res.status(404).json({ success: false, message: `Bowser ${id} not found.` });
      }
      if (status) bowser.status = status;
      if (currentLocation) bowser.currentLocation = currentLocation;

      return res.status(200).json({ success: true, data: bowser });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or deactivate bowser
// @route   DELETE /api/bowsers/:id
const deleteBowser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getMongoStatus()) {
      let query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { bowserId: id };
      const bowser = await Bowser.findOneAndDelete(query);
      if (!bowser) {
        return res.status(404).json({ success: false, message: `Bowser ${id} not found.` });
      }
      return res.status(200).json({ success: true, message: `Bowser ${id} deactivated/deleted successfully.` });
    } else {
      const index = memoryStore.bowsers.findIndex(b => b._id === id || b.bowserId === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: `Bowser ${id} not found.` });
      }
      memoryStore.bowsers.splice(index, 1);
      return res.status(200).json({ success: true, message: `Bowser ${id} deactivated/deleted successfully.` });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBowsers,
  createBowser,
  updateBowser,
  updateBowserStatus,
  deleteBowser
};
