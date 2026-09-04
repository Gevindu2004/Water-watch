const Village = require('../models/Village');
const Delivery = require('../models/Delivery');

exports.getVillages = async (req, res) => {
  try {
    const villages = await Village.find();
    res.json(villages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVillageStatus = async (req, res) => {
  try {
    const village = await Village.findById(req.params.id);
    if (!village) {
      return res.status(404).json({ message: 'Village not found' });
    }
    
    // Also fetch the next scheduled delivery if any
    const nextDelivery = await Delivery.findOne({ 
      village: village._id, 
      status: { $in: ['Available', 'On the way', 'Delayed'] } 
    }).sort({ expectedArrival: 1 });

    res.json({
      village,
      nextDelivery
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
