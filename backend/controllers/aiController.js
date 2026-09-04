const { getNextRecommendation } = require('../services/recommendationService');
const { generateAiExplanation, getAiHealthStatus } = require('../services/aiService');

/**
 * GET /api/ai/recommendation
 * Determines highest priority village, optimal bowser, capacity, reason, impact, and explanation
 */
async function getRecommendation(req, res) {
  try {
    const recommendation = await getNextRecommendation();

    if (!recommendation || recommendation.success === false) {
      return res.status(404).json({
        success: false,
        message: recommendation ? recommendation.message : 'No recommendation available'
      });
    }

    // Return the exact JSON structure specified in the objective:
    // {
    //   "village": "Siripura",
    //   "priorityScore": 91,
    //   "priority": "CRITICAL",
    //   "recommendedBowser": "WB-102",
    //   "capacity": 5000,
    //   "reason": "Siripura has had no water for 3 days and approximately 120 people are affected."
    // }
    return res.status(200).json({
      village: recommendation.village,
      villageId: recommendation.villageId,
      division: recommendation.division,
      priorityScore: recommendation.priorityScore,
      priority: recommendation.priority,
      priorityBadge: recommendation.priorityBadge,
      priorityColor: recommendation.priorityColor,
      recommendedBowser: recommendation.recommendedBowser,
      bowserDetails: recommendation.bowserDetails,
      capacity: recommendation.capacity,
      requiredCapacity: recommendation.requiredCapacity,
      reason: recommendation.reason,
      expectedImpact: recommendation.expectedImpact,
      urgencyFactors: recommendation.urgencyFactors,
      breakdown: recommendation.breakdown,
      tank: recommendation.tank,
      explanation: recommendation.explanation,
      aiMeta: recommendation.aiMeta
    });
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate recommendation',
      error: error.message
    });
  }
}

/**
 * POST /api/ai/explanation
 * Explains a structured decision without deciding the raw score
 */
async function generateExplanation(req, res) {
  try {
    const data = req.body;

    if (!data || !data.villageName) {
      return res.status(400).json({
        success: false,
        message: 'Request body must contain at least villageName and scoring parameters.'
      });
    }

    const explanationResult = await generateAiExplanation(data);

    return res.status(200).json({
      success: true,
      data: explanationResult
    });
  } catch (error) {
    console.error('Error in POST /api/ai/explanation:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating explanation',
      error: error.message
    });
  }
}

/**
 * GET /api/ai/health
 * Returns health and fallback engine status
 */
function getAiHealth(req, res) {
  try {
    const health = getAiHealthStatus();
    return res.status(200).json(health);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

module.exports = {
  getRecommendation,
  generateExplanation,
  getAiHealth
};
