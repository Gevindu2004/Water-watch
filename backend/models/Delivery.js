const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
  bowserId: { type: String, required: true },
  capacity: { type: Number, required: true },
  expectedArrival: { type: Date, required: true },
  distributionPoint: { type: String, required: true },
  peopleWaiting: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Available', 'On the way', 'Distributing', 'Completed', 'Delayed'],
    default: 'Available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
