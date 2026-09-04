const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');
const reportController = require('../controllers/reportController');
const deliveryController = require('../controllers/deliveryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Village routes
router.get('/villages', villageController.getVillages);
router.post('/villages', protect, admin, villageController.addVillage);
router.get('/villages/:id/status', villageController.getVillageStatus);
router.put('/villages/:id', protect, admin, villageController.updateVillage);

// Water Report routes
router.post('/water-reports', protect, reportController.createReport);
router.get('/water-reports/village/:villageId', reportController.getVillageReports);

// Delivery routes
router.get('/deliveries/village/:villageId', deliveryController.getVillageDeliveries);
router.post('/deliveries/:deliveryId/join-queue', protect, deliveryController.joinQueue);

module.exports = router;
