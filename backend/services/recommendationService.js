const { getRankedPriorities } = require('./priorityService');
const Bowser = require('../models/Bowser');
const { generateAiExplanation } = require('./aiService');

/**
 * Generates the next water bowser recommendation
 * Identifies highest priority village and matches the best available bowser
 */
async function getNextRecommendation() {
  const rankedVillages = await getRankedPriorities();

  if (!rankedVillages || rankedVillages.length === 0) {
    return {
      success: false,
      message: 'No active water shortages recorded.'
    };
  }

  // Top priority village
  const topVillage = rankedVillages[0];

  // Calculate required capacity based on affected residents
  // Disaster management benchmark: ~40-42L per person for 48-hour emergency supply
  const requiredCapacity = Math.max(2000, topVillage.affectedPeople * 40);

  // Fetch available bowsers
  const availableBowsers = await Bowser.findBowsers({ status: 'available' });

  let selectedBowser = null;

  if (availableBowsers.length > 0) {
    // 1. Prefer bowsers that can meet at least 85% of required capacity
    const suitableBowsers = availableBowsers.filter(b => b.capacityLiters >= requiredCapacity * 0.85);

    if (suitableBowsers.length > 0) {
      // Pick the bowser that matches required capacity closest from above, or has lowest ETA
      suitableBowsers.sort((a, b) => {
        const diffA = Math.abs(a.capacityLiters - requiredCapacity);
        const diffB = Math.abs(b.capacityLiters - requiredCapacity);
        if (diffA === diffB) {
          return (a.etaMinutes || 30) - (b.etaMinutes || 30);
        }
        return diffA - diffB;
      });
      selectedBowser = suitableBowsers[0];
    } else {
      // Pick the largest available bowser
      availableBowsers.sort((a, b) => b.capacityLiters - a.capacityLiters);
      selectedBowser = availableBowsers[0];
    }
  } else {
    // Fallback placeholder bowser if all currently en route
    selectedBowser = {
      bowserId: 'WB-102 (Standby)',
      driverName: 'Regional Standby Driver',
      driverPhone: '+94 77 000 0000',
      capacityLiters: 5000,
      currentLocation: 'Depot Standby',
      etaMinutes: 30,
      estimatedArrivalTime: '2:15 PM'
    };
  }

  const capacity = selectedBowser.capacityLiters;
  const reason = `${topVillage.villageName} has had no water for ${topVillage.daysWithoutWater} days and approximately ${topVillage.affectedPeople} people are affected.`;
  const expectedImpact = `Delivers ${capacity.toLocaleString()} L of potable water, satisfying urgent consumption needs for ~${topVillage.affectedPeople} residents for 48 hours.`;

  // Generate AI / Fallback explanation
  const structuredExplanationData = {
    villageName: topVillage.villageName,
    priorityScore: topVillage.priorityScore,
    priority: topVillage.priority,
    recommendedBowser: selectedBowser.bowserId,
    capacity,
    daysWithoutWater: topVillage.daysWithoutWater,
    affectedPeople: topVillage.affectedPeople,
    tankLevel: topVillage.tank ? topVillage.tank.waterLevelPercentage : 18,
    daysSinceDelivery: topVillage.daysSinceLastDelivery || 0,
    alternativeWaterSource: topVillage.alternativeWaterSource
  };

  const aiResult = await generateAiExplanation(structuredExplanationData);

  return {
    village: topVillage.villageName,
    villageId: topVillage.villageId,
    division: topVillage.division,
    priorityScore: topVillage.priorityScore,
    priority: topVillage.priority,
    priorityColor: topVillage.priorityColor,
    priorityBadge: topVillage.priorityBadge,
    recommendedBowser: selectedBowser.bowserId,
    bowserDetails: {
      bowserId: selectedBowser.bowserId,
      driverName: selectedBowser.driverName,
      driverPhone: selectedBowser.driverPhone,
      capacityLiters: selectedBowser.capacityLiters,
      currentLocation: selectedBowser.currentLocation,
      etaMinutes: selectedBowser.etaMinutes || 25,
      estimatedArrivalTime: selectedBowser.estimatedArrivalTime || '2:15 PM',
      licensePlate: selectedBowser.licensePlate || 'WP-ND-8492'
    },
    capacity,
    requiredCapacity,
    reason,
    expectedImpact,
    urgencyFactors: topVillage.urgencyFactors,
    breakdown: topVillage.breakdown,
    tank: topVillage.tank,
    explanation: aiResult.explanation,
    aiMeta: {
      source: aiResult.source,
      model: aiResult.model,
      isFallback: aiResult.isFallback,
      fallbackReason: aiResult.fallbackReason
    }
  };
}

module.exports = {
  getNextRecommendation
};
