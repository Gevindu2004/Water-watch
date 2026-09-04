const express = require('express');
const router = express.Router();
const {
  getAllBowsers,
  createBowser,
  updateBowser,
  updateBowserStatus,
  deleteBowser
} = require('../controllers/bowserController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.route('/')
  .get(getAllBowsers)
  .post(authorizeRoles('officer', 'admin'), createBowser);

router.route('/:id')
  .put(authorizeRoles('officer', 'admin'), updateBowser)
  .delete(authorizeRoles('officer', 'admin'), deleteBowser);

router.route('/:id/status')
  .patch(authorizeRoles('officer', 'admin'), updateBowserStatus);

module.exports = router;
