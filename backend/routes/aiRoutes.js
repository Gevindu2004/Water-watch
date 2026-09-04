const express = require('express');
const router = express.Router();
const {
  getPriorities,
  getVillagePriority,
  getNextBowserRecommendation,
  getAIExplanation,
  getAIHealth
} = require('../controllers/aiPriorityController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/health', getAIHealth);

// Available to both admin and officer
router.use(authenticateToken);
router.use(authorizeRoles('admin', 'officer'));

router.get('/priorities', getPriorities);
router.get('/priorities/:villageId', getVillagePriority);
router.get('/recommendation', getNextBowserRecommendation);
router.post('/explanation', getAIExplanation);

module.exports = router;
