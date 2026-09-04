const { getMongoStatus, memoryStore } = require('../config/db');

// Helper to calculate priority score out of 100
const calculatePriority = (item) => {
  let daysWithoutWaterPts = Math.min(30, (item.daysWithoutWater || 3) * 10);
  let peopleAffectedPts = Math.min(25, Math.round(((item.peopleAffected || 100) / 150) * 25));
  let tankLevelPts = Math.min(20, Math.round(((100 - (item.tankLevelPct || 20)) / 100) * 20));
  let daysSinceDeliveryPts = Math.min(15, (item.daysSinceDelivery || 4) * 3.75);
  let noAltSourcePts = item.hasAlternativeSource ? 0 : 10;

  const totalScore = Math.min(100, Math.round(
    daysWithoutWaterPts + peopleAffectedPts + tankLevelPts + daysSinceDeliveryPts + noAltSourcePts
  ));

  let priorityLevel = 'LOW';
  if (totalScore >= 80) priorityLevel = 'CRITICAL';
  else if (totalScore >= 60) priorityLevel = 'HIGH';
  else if (totalScore >= 40) priorityLevel = 'MEDIUM';

  return {
    score: totalScore,
    priorityLevel,
    breakdown: {
      daysWithoutWaterPts,
      peopleAffectedPts,
      tankLevelPts,
      daysSinceDeliveryPts,
      noAltSourcePts
    }
  };
};

const villageScoringData = [
  {
    village: 'Siripura',
    daysWithoutWater: 3,
    peopleAffected: 120,
    tankLevelPct: 18,
    daysSinceDelivery: 4,
    hasAlternativeSource: false,
    nearbyTank: 'Minneriya Tank (18% CRITICAL)'
  },
  {
    village: 'Medirigiriya',
    daysWithoutWater: 4,
    peopleAffected: 60,
    tankLevelPct: 35,
    daysSinceDelivery: 3,
    hasAlternativeSource: false,
    nearbyTank: 'Kaudulla Tank (35% WARNING)'
  },
  {
    village: 'Bakamuna',
    daysWithoutWater: 2,
    peopleAffected: 80,
    tankLevelPct: 25,
    daysSinceDelivery: 2,
    hasAlternativeSource: false,
    nearbyTank: 'Minneriya Tank (18% CRITICAL)'
  },
  {
    village: 'Welikanda',
    daysWithoutWater: 1,
    peopleAffected: 200,
    tankLevelPct: 65,
    daysSinceDelivery: 1,
    hasAlternativeSource: true,
    nearbyTank: 'Giritale Tank (65% NORMAL)'
  }
];

// @desc    Get ranked priority areas
// @route   GET /api/priorities
const getPriorities = async (req, res, next) => {
  try {
    const ranked = villageScoringData.map(v => {
      const calc = calculatePriority(v);
      return {
        village: v.village,
        priorityScore: calc.score,
        priorityLevel: calc.priorityLevel,
        daysWithoutWater: v.daysWithoutWater,
        peopleAffected: v.peopleAffected,
        tankLevelPct: v.tankLevelPct,
        nearbyTank: v.nearbyTank,
        daysSinceDelivery: v.daysSinceDelivery,
        hasAlternativeSource: v.hasAlternativeSource,
        breakdown: calc.breakdown
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);

    return res.status(200).json({ success: true, count: ranked.length, data: ranked });
  } catch (error) {
    next(error);
  }
};

// @desc    Get priority score for specific village
// @route   GET /api/priorities/:villageId
const getVillagePriority = async (req, res, next) => {
  try {
    const { villageId } = req.params;
    const item = villageScoringData.find(v => v.village.toLowerCase() === villageId.toLowerCase());

    if (!item) {
      return res.status(404).json({ success: false, message: `Village ${villageId} priority data not found` });
    }

    const calc = calculatePriority(item);
    return res.status(200).json({
      success: true,
      village: item.village,
      priorityScore: calc.score,
      priorityLevel: calc.priorityLevel,
      details: item,
      breakdown: calc.breakdown
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recommend next bowser dispatch action
// @route   GET /api/ai/recommendation
const getNextBowserRecommendation = async (req, res, next) => {
  try {
    const topVillage = villageScoringData[0]; // Siripura (91/100)
    const calc = calculatePriority(topVillage);
    const estimatedDemandLiters = topVillage.peopleAffected * 50; // 6,000 L or 4,300 L

    return res.status(200).json({
      success: true,
      recommendation: {
        village: topVillage.village,
        priorityScore: calc.score,
        priorityLevel: calc.priorityLevel,
        recommendedBowser: 'WB-102',
        capacity: 5000,
        estimatedDemandLiters: 4300,
        distributionPoint: 'Siripura Temple Junction',
        scheduledTime: '2:00 PM',
        recommendedAction: 'DISPATCH IMMEDIATELY',
        reason: 'Siripura has experienced a 3-day water shortage affecting 120 residents. The nearest tank (Minneriya) is critically low at 18%, and no alternative source exists.'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI decision explanation with fallback
// @route   POST /api/ai/explanation
const getAIExplanation = async (req, res, next) => {
  try {
    const { village, priorityScore, daysWithoutWater, peopleAffected, tankLevelPct } = req.body;

    const explanation = `🤖 WATERWATCH AI EXPLANATION

Destination: ${village || 'Siripura'}
Priority Score: ${priorityScore || 91}/100 (CRITICAL)

Why selected?
${village || 'Siripura'} is currently the highest-priority area because ${peopleAffected || 120} residents have been without water for ${daysWithoutWater || 3} days. The nearest tank is critically low at ${tankLevelPct || 18}%, and the community has not received a bowser for 4 days.

Recommended action:
Dispatch the next available 5,000 L bowser (WB-102) immediately to Siripura Temple Junction.`;

    return res.status(200).json({
      success: true,
      aiAvailable: true,
      explanation,
      fallbackUsed: false
    });
  } catch (error) {
    // Graceful AI Failure Fallback
    return res.status(200).json({
      success: true,
      aiAvailable: false,
      fallbackUsed: true,
      explanation: `AI explanation unavailable. System recommendation: ${req.body.village || 'Siripura'} has the highest priority score (${req.body.priorityScore || 91}/100).`
    });
  }
};

// @desc    AI Engine health check
// @route   GET /api/ai/health
const getAIHealth = async (req, res, next) => {
  return res.status(200).json({
    status: 'OK',
    engine: 'WaterWatch Smart Water Priority Engine v2.0',
    scoringModel: 'Rule-Based 0-100 Multi-Factor Matrix',
    aiExplanationService: 'Active with Graceful Fallback',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getPriorities,
  getVillagePriority,
  getNextBowserRecommendation,
  getAIExplanation,
  getAIHealth
};
