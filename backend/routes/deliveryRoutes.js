const express = require('express');
const router = express.Router();
const {
  getAllDeliveries,
  createDelivery,
  updateDelivery,
  updateDeliveryStatus,
  getDeliveriesByVillage,
  updateQueue
} = require('../controllers/deliveryController');

router.route('/')
  .get(getAllDeliveries)
  .post(createDelivery);

router.route('/:id')
  .put(updateDelivery);

router.route('/:id/status')
  .patch(updateDeliveryStatus);

router.route('/village/:villageId')
  .get(getDeliveriesByVillage);

router.route('/:id/queue')
  .patch(updateQueue);

module.exports = router;
