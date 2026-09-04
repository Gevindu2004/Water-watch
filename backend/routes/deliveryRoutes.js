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
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public endpoint for Member 1 Resident Portal & Village Lookups
router.route('/village/:villageId').get(getDeliveriesByVillage);

// Public endpoint for Residents to indicate attendance (queue update)
router.route('/:id/queue').patch(updateQueue);

// Protected Official Endpoints (Officer & Admin)
router.use(authenticateToken);

router.route('/')
  .get(getAllDeliveries)
  .post(authorizeRoles('officer', 'admin'), createDelivery);

router.route('/:id')
  .put(authorizeRoles('officer', 'admin'), updateDelivery);

router.route('/:id/status')
  .patch(authorizeRoles('officer', 'admin'), updateDeliveryStatus);

module.exports = router;
