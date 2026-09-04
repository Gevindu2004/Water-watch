import express from 'express';
import {
  getAllTanks,
  getTankById,
  createTank,
  updateTank,
  updateTankLevel,
  getTankHistory,
  getTankAlerts,
  seedTanksData
} from '../controllers/tankController.js';

const router = express.Router();

// Specific routes first to prevent :id param matching
router.get('/alerts', getTankAlerts);
router.post('/seed', seedTanksData);

// General routes
router.get('/', getAllTanks);
router.get('/:id', getTankById);
router.post('/', createTank);
router.put('/:id', updateTank);
router.patch('/:id/level', updateTankLevel);
router.get('/:id/history', getTankHistory);

export default router;
