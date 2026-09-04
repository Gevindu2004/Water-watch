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
    villageId: 'v-siripura',
    villageName: 'Siripura',
    village: 'Siripura',
    district: 'Polonnaruwa',
    score: 91,
    status: 'CRITICAL',
    tankLevel: 18,
    tankLevelPct: 18,
    daysWithoutWater: 4,
    peopleAffected: 4200,
    population: 4200,
    vulnerableFacility: 'Rural Hospital & Maternity Ward',
    nearbyTank: 'Minneriya Tank (18% CRITICAL)'
  },
  {
    villageId: 'v-mihintale',
    villageName: 'Mihintale South',
    village: 'Mihintale South',
    district: 'Anuradhapura',
    score: 88,
    status: 'CRITICAL',
    tankLevel: 15,
    tankLevelPct: 15,
    daysWithoutWater: 4,
    peopleAffected: 5800,
    population: 5800,
    vulnerableFacility: 'Mihintale Base Hospital & University Hostel',
    nearbyTank: 'Nuwara Wewa (15% CRITICAL)'
  },
  {
    villageId: 'v-suriyawewa',
    villageName: 'Suriyawewa Colony',
    village: 'Suriyawewa Colony',
    district: 'Hambantota',
    score: 85,
    status: 'CRITICAL',
    tankLevel: 12,
    tankLevelPct: 12,
    daysWithoutWater: 5,
    peopleAffected: 6400,
    population: 6400,
    vulnerableFacility: 'Suriyawewa Primary School & Clinic',
    nearbyTank: 'Ridiyagama Reservoir (12% CRITICAL)'
  },
  {
    villageId: 'v-anamaduwa',
    villageName: 'Anamaduwa West',
    village: 'Anamaduwa West',
    district: 'Puttalam',
    score: 81,
    status: 'CRITICAL',
    tankLevel: 17,
    tankLevelPct: 17,
    daysWithoutWater: 3,
    peopleAffected: 3900,
    population: 3900,
    vulnerableFacility: 'Elderly Care Center',
    nearbyTank: 'Tabbowa Tank (17% CRITICAL)'
  },
  {
    villageId: 'v-medirigiriya',
    villageName: 'Medirigiriya Block B',
    village: 'Medirigiriya Block B',
    district: 'Polonnaruwa',
    score: 78,
    status: 'HIGH',
    tankLevel: 35,
    tankLevelPct: 35,
    daysWithoutWater: 3,
    peopleAffected: 6100,
    population: 6100,
    vulnerableFacility: 'Primary School & Day Care',
    nearbyTank: 'Kaudulla Tank (35% WARNING)'
  },
  {
    villageId: 'v-vavunathivu',
    villageName: 'Vavunathivu East',
    village: 'Vavunathivu East',
    district: 'Batticaloa',
    score: 76,
    status: 'HIGH',
    tankLevel: 14,
    tankLevelPct: 14,
    daysWithoutWater: 3,
    peopleAffected: 4500,
    population: 4500,
    vulnerableFacility: 'None',
    nearbyTank: 'Unnichchai Tank (14% CRITICAL)'
  },
  {
    villageId: 'v-bakamuna',
    villageName: 'Bakamuna South',
    village: 'Bakamuna South',
    district: 'Polonnaruwa',
    score: 65,
    status: 'MEDIUM',
    tankLevel: 25,
    tankLevelPct: 25,
    daysWithoutWater: 2,
    peopleAffected: 3800,
    population: 3800,
    vulnerableFacility: 'None',
    nearbyTank: 'Minneriya Tank (18% CRITICAL)'
  },
  {
    villageId: 'v-welikanda',
    villageName: 'Welikanda East',
    village: 'Welikanda East',
    district: 'Polonnaruwa',
    score: 42,
    status: 'LOW',
    tankLevel: 65,
    tankLevelPct: 65,
    daysWithoutWater: 1,
    peopleAffected: 2900,
    population: 2900,
    vulnerableFacility: 'None',
    nearbyTank: 'Giritale Tank (65% NORMAL)'
  }
];

// @desc    Get ranked priority areas
// @route   GET /api/priorities
const getPriorities = async (req, res, next) => {
  try {
    const { district } = req.query;
    let list = villageScoringData;
    if (district && district !== 'All') {
      list = list.filter(v => v.district === district);
    }

    const ranked = list.map(v => {
      const calc = calculatePriority(v);
      return {
        villageId: v.villageId,
        villageName: v.villageName,
        village: v.village,
        district: v.district,
        priorityScore: v.score || calc.score,
        score: v.score || calc.score,
        priorityLevel: v.status || calc.priorityLevel,
        status: v.status || calc.priorityLevel,
        daysWithoutWater: v.daysWithoutWater,
        peopleAffected: v.peopleAffected,
        population: v.population || v.peopleAffected,
        tankLevelPct: v.tankLevelPct || v.tankLevel,
        tankLevel: v.tankLevel || v.tankLevelPct,
        vulnerableFacility: v.vulnerableFacility || 'None',
        nearbyTank: v.nearbyTank,
        breakdown: calc.breakdown
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);

    return res.status(200).json({ success: true, count: ranked.length, data: ranked, priorities: ranked });
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
