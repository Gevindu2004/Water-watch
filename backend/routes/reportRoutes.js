const express = require('express');
const router = express.Router();
const { getAllReports, verifyReport } = require('../controllers/reportController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.route('/')
  .get(authorizeRoles('officer', 'admin'), getAllReports);

router.route('/:id/verify')
  .patch(authorizeRoles('officer', 'admin'), verifyReport);

module.exports = router;
