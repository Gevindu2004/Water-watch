const express = require('express');
const router = express.Router();
const { getRecommendation, generateExplanation, getAiHealth } = require('../controllers/aiController');

router.get('/recommendation', getRecommendation);
router.post('/explanation', generateExplanation);
router.get('/health', getAiHealth);

module.exports = router;
