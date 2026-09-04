const express = require('express');
const router = express.Router();
const { login, getMe, registerOfficer } = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.post('/register-officer', authenticateToken, authorizeRoles('officer', 'admin'), registerOfficer);

module.exports = router;
