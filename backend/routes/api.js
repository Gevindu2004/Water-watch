const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');
const reportController = require('../controllers/reportController');
const deliveryController = require('../controllers/deliveryController');

// Village routes
router.get('/villages', villageController.getVillages);
router.get('/villages/:id/status', villageController.getVillageStatus);

// Water Report routes
router.post('/water-reports', reportController.createReport);
router.get('/water-reports/village/:villageId', reportController.getVillageReports);

// Delivery routes
router.get('/deliveries/village/:villageId', deliveryController.getVillageDeliveries);
router.post('/deliveries/:deliveryId/join-queue', deliveryController.joinQueue);

module.exports = router;
