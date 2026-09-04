const Delivery = require('../models/Delivery');
const Bowser = require('../models/Bowser');
const { getMongoStatus, memoryStore } = require('../config/db');

// Helper to update associated bowser status
const syncBowserStatus = async (bowserId, deliveryStatus) => {
  let newBowserStatus = 'Assigned';
  if (deliveryStatus === 'On The Way') newBowserStatus = 'On The Way';
  if (deliveryStatus === 'Distributing') newBowserStatus = 'Distributing';
  if (deliveryStatus === 'Completed') newBowserStatus = 'Available';
  if (deliveryStatus === 'Delayed') newBowserStatus = 'Delayed';

  if (getMongoStatus()) {
    await Bowser.findOneAndUpdate(
      { bowserId: bowserId },
      { status: newBowserStatus }
    );
  } else {
    const bowser = memoryStore.bowsers.find(b => b.bowserId === bowserId || b._id === bowserId);
    if (bowser) {
      bowser.status = newBowserStatus;
    }
  }
};

// @desc    Get all deliveries
// @route   GET /api/deliveries
const getAllDeliveries = async (req, res, next) => {
  try {
    if (getMongoStatus()) {
      const deliveries = await Delivery.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: deliveries.length, data: deliveries });
    } else {
      return res.status(200).json({ success: true, count: memoryStore.deliveries.length, data: memoryStore.deliveries });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new water delivery schedule
// @route   POST /api/deliveries
const createDelivery = async (req, res, next) => {
  try {
    const { bowserId, villageId, distributionPoint, scheduledDate, estimatedArrival, capacity, peopleWaiting } = req.body;

    if (!bowserId || !villageId || !distributionPoint || !scheduledDate || !estimatedArrival) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bowserId, villageId, distributionPoint, scheduledDate, estimatedArrival'
      });
    }

    const deliveryCapacity = Number(capacity) || 5000;
    const waitingCount = Number(peopleWaiting) || 0;

    if (getMongoStatus()) {
      const delivery = await Delivery.create({
        bowserId,
        villageId,
        distributionPoint,
        scheduledDate,
        estimatedArrival,
        capacity: deliveryCapacity,
        status: 'Scheduled',
        peopleWaiting: waitingCount
      });

      await syncBowserStatus(bowserId, 'Scheduled');

      return res.status(201).json({ success: true, data: delivery });
    } else {
      const newDelivery = {
        _id: 'del-' + Date.now(),
        bowserId,
        villageId,
        distributionPoint,
        scheduledDate,
        estimatedArrival,
        capacity: deliveryCapacity,
        status: 'Scheduled',
        peopleWaiting: waitingCount,
        createdAt: new Date()
      };

      memoryStore.deliveries.unshift(newDelivery);
      await syncBowserStatus(bowserId, 'Scheduled');

      return res.status(201).json({ success: true, data: newDelivery });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery full details
// @route   PUT /api/deliveries/:id
const updateDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (getMongoStatus()) {
      const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { _id: id };
      const delivery = await Delivery.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!delivery) {
        return res.status(404).json({ success: false, message: `Delivery ${id} not found.` });
      }
      if (updates.status) {
        await syncBowserStatus(delivery.bowserId, updates.status);
      }
      return res.status(200).json({ success: true, data: delivery });
    } else {
      const index = memoryStore.deliveries.findIndex(d => d._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: `Delivery ${id} not found.` });
      }
      memoryStore.deliveries[index] = { ...memoryStore.deliveries[index], ...updates };
      if (updates.status) {
        await syncBowserStatus(memoryStore.deliveries[index].bowserId, updates.status);
      }
      return res.status(200).json({ success: true, data: memoryStore.deliveries[index] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery status
// @route   PATCH /api/deliveries/:id/status
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Scheduled', 'On The Way', 'Distributing', 'Completed', 'Delayed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status is required and must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (getMongoStatus()) {
      const delivery = await Delivery.findByIdAndUpdate(id, { status }, { new: true });
      if (!delivery) {
        return res.status(404).json({ success: false, message: `Delivery ${id} not found.` });
      }
      await syncBowserStatus(delivery.bowserId, status);
      return res.status(200).json({ success: true, data: delivery });
    } else {
      const delivery = memoryStore.deliveries.find(d => d._id === id);
      if (!delivery) {
        return res.status(404).json({ success: false, message: `Delivery ${id} not found.` });
      }
      delivery.status = status;
      await syncBowserStatus(delivery.bowserId, status);
      return res.status(200).json({ success: true, data: delivery });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get deliveries by village (For Resident Portal integration by Member 1)
// @route   GET /api/deliveries/village/:villageId
const getDeliveriesByVillage = async (req, res, next) => {
  try {
    const { villageId } = req.params;
    const searchRegex = new RegExp(villageId, 'i');

    if (getMongoStatus()) {
      const deliveries = await Delivery.find({
        villageId: { $regex: searchRegex }
      }).sort({ createdAt: -1 });

      return res.status(200).json({ success: true, village: villageId, count: deliveries.length, data: deliveries });
    } else {
      const deliveries = memoryStore.deliveries.filter(d =>
        d.villageId.toLowerCase() === villageId.toLowerCase()
      );
      return res.status(200).json({ success: true, village: villageId, count: deliveries.length, data: deliveries });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update people waiting / queue for a delivery
// @route   PATCH /api/deliveries/:id/queue
const updateQueue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, change, peopleWaiting } = req.body;

    if (getMongoStatus()) {
      const delivery = await Delivery.findById(id);
      if (!delivery) {
        return res.status(404).json({ success: false, message: `Delivery ${id} not found.` });
      }

      if (typeof peopleWaiting === 'number') {
        delivery.peopleWaiting = Math.max(0, peopleWaiting);
      } else if (action === 'increment') {
        delivery.peopleWaiting += 1;
      } else if (action === 'decrement') {
        delivery.peopleWaiting = Math.max(0, delivery.peopleWaiting - 1);
      } else if (typeof change === 'number') {
        delivery.peopleWaiting = Math.max(0, delivery.peopleWaiting + change);
      } else {
        delivery.peopleWaiting += 1;
      }

      await delivery.save();
      return res.status(200).json({
        success: true,
        message: 'Queue updated successfully',
        data: delivery
      });
    } else {
      const delivery = memoryStore.deliveries.find(d => d._id === id);
      if (!delivery) {
        return res.status(404).json({ success: false, message: `Delivery ${id} not found.` });
      }

      if (typeof peopleWaiting === 'number') {
        delivery.peopleWaiting = Math.max(0, peopleWaiting);
      } else if (action === 'increment') {
        delivery.peopleWaiting += 1;
      } else if (action === 'decrement') {
        delivery.peopleWaiting = Math.max(0, delivery.peopleWaiting - 1);
      } else if (typeof change === 'number') {
        delivery.peopleWaiting = Math.max(0, delivery.peopleWaiting + change);
      } else {
        delivery.peopleWaiting += 1;
      }

      return res.status(200).json({
        success: true,
        message: 'Queue updated successfully',
        data: delivery
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDeliveries,
  createDelivery,
  updateDelivery,
  updateDeliveryStatus,
  getDeliveriesByVillage,
  updateQueue
};
