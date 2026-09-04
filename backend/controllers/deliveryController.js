const Delivery = require('../models/Delivery');

exports.getVillageDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ village: req.params.villageId })
                                     .sort({ expectedArrival: 1 });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinQueue = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    delivery.peopleWaiting += 1;
    await delivery.save();
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
