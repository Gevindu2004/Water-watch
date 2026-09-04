const express = require('express');
const router = express.Router();
const {
  getAllTanks,
  getTankAlerts,
  getTankById,
  createTank,
  updateTank,
  updateTankLevel,
  getTankHistory
} = require('../controllers/tankController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/alerts', getTankAlerts);
router.get('/', getAllTanks);
router.get('/:id', getTankById);
router.get('/:id/history', getTankHistory);

// Protected Admin Routes
router.use(authenticateToken);
router.post('/', authorizeRoles('admin'), createTank);
router.put('/:id', authorizeRoles('admin'), updateTank);
router.patch('/:id/level', authorizeRoles('admin', 'officer'), updateTankLevel);

module.exports = router;
