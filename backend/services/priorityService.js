const ShortageReport = require('../models/ShortageReport');
const Tank = require('../models/Tank');

/**
 * Calculates rule-based priority score (0-100) and full explainable breakdown
 * Based on 5 core indicators:
 * 1. Days without water (Max 30 pts)
 * 2. People affected (Max 25 pts)
 * 3. Tank level (Max 20 pts)
 * 4. Days since previous delivery (Max 15 pts)
 * 5. Alternative water source availability (Max 10 pts)
 */
function calculatePriorityScore({
  daysWithoutWater = 0,
  affectedPeople = 0,
  tankLevelPercentage = 50,
  daysSinceLastDelivery = 0,
  alternativeWaterSource = 'none'
}) {
  // 1. Days without water (Max 30 pts) - 10 pts per day up to 3 days
  const daysWithoutWaterPoints = Math.min(30, Math.round(daysWithoutWater * 10));

  // 2. People affected (Max 25 pts) - Normalized to 150 people threshold
  const peopleAffectedPoints = Math.min(25, Math.round((affectedPeople / 150) * 25));

  // 3. Tank level (Max 20 pts) - Inverted: lower tank level = higher urgency
  const tankDeficit = Math.max(0, 100 - tankLevelPercentage);
  const tankLevelPoints = Math.round(tankDeficit * 0.20);

  // 4. Days since previous delivery (Max 15 pts) - 3.75 pts per day up to 4 days
  const deliveryPoints = Math.min(15, Math.round(daysSinceLastDelivery * 3.75));

  // 5. Alternative source (Max 10 pts)
  let alternativeSourcePoints = 0;
  if (alternativeWaterSource === 'none') {
    alternativeSourcePoints = 10;
  } else if (alternativeWaterSource === 'limited') {
    alternativeSourcePoints = 5;
  } else {
    alternativeSourcePoints = 0;
  }

  const rawScore = daysWithoutWaterPoints + peopleAffectedPoints + tankLevelPoints + deliveryPoints + alternativeSourcePoints;
  const totalScore = Math.min(100, Math.max(0, rawScore));

  // Determine priority classification
  let priority = 'LOW';
  let priorityBadge = '🟢 LOW';
  let priorityColor = '#10B981';

  if (totalScore >= 80) {
    priority = 'CRITICAL';
    priorityBadge = '🔴 CRITICAL';
    priorityColor = '#EF4444';
  } else if (totalScore >= 60) {
    priority = 'WARNING';
    priorityBadge = '🟠 WARNING';
    priorityColor = '#F59E0B';
  } else if (totalScore >= 40) {
    priority = 'MODERATE';
    priorityBadge = '🟡 MODERATE';
    priorityColor = '#EAB308';
  }

  const breakdown = {
    daysWithoutWater: {
      value: daysWithoutWater,
      points: daysWithoutWaterPoints,
      max: 30,
      label: 'Days without water',
      formula: '10 pts per day (max 30 pts)'
    },
    affectedPeople: {
      value: affectedPeople,
      points: peopleAffectedPoints,
      max: 25,
      label: 'People affected',
      formula: 'Scaled against 150 people threshold (max 25 pts)'
    },
    tankLevel: {
      value: `${tankLevelPercentage}%`,
      points: tankLevelPoints,
      max: 20,
      label: 'Nearby tank level deficit',
      formula: `(100% - ${tankLevelPercentage}%) × 0.20 weight`
    },
    daysSinceDelivery: {
      value: `${daysSinceLastDelivery} days`,
      points: deliveryPoints,
      max: 15,
      label: 'Days since previous delivery',
      formula: '3.75 pts per day (max 15 pts)'
    },
    alternativeSource: {
      value: alternativeWaterSource.toUpperCase(),
      points: alternativeSourcePoints,
      max: 10,
      label: 'No alternative source',
      formula: 'None = 10 pts, Limited = 5 pts, Adequate = 0 pts'
    }
  };

  const urgencyFactors = [];
  if (daysWithoutWater >= 3) urgencyFactors.push(`${daysWithoutWater} Days Without Water`);
  if (tankLevelPercentage <= 20) urgencyFactors.push(`Critical Tank Deficit (${tankLevelPercentage}%)`);
  if (alternativeWaterSource === 'none') urgencyFactors.push('Zero Alternative Sources');
  if (daysSinceLastDelivery >= 4) urgencyFactors.push(`No Delivery in ${daysSinceLastDelivery} Days`);
  if (affectedPeople >= 100) urgencyFactors.push(`${affectedPeople}+ Residents Affected`);

  return {
    score: totalScore,
    priority,
    priorityBadge,
    priorityColor,
    breakdown,
    urgencyFactors
  };
}

/**
 * Retrieves all active shortage reports, enriches with tank data,
 * calculates priority scores, and returns ordered priority ranking.
 */
async function getRankedPriorities() {
  const [reports, tanks] = await Promise.all([
    ShortageReport.findReports(),
    Tank.findTanks()
  ]);

  const tankMap = {};
  tanks.forEach(t => {
    tankMap[t.villageId] = t;
    tankMap[t.villageName.toLowerCase()] = t;
  });

  const scoredVillages = reports.map(report => {
    const matchedTank = tankMap[report.villageId] || tankMap[report.villageName.toLowerCase()] || {
      tankName: 'Unknown Tank',
      waterLevelPercentage: 50,
      capacityLiters: 100000,
      status: 'normal'
    };

    const scoring = calculatePriorityScore({
      daysWithoutWater: report.daysWithoutWater,
      affectedPeople: report.affectedPeople,
      tankLevelPercentage: matchedTank.waterLevelPercentage,
      daysSinceLastDelivery: report.daysSinceLastDelivery || 0,
      alternativeWaterSource: report.alternativeWaterSource
    });

    return {
      villageId: report.villageId,
      villageName: report.villageName,
      division: report.division,
      status: report.status,
      daysWithoutWater: report.daysWithoutWater,
      affectedPeople: report.affectedPeople,
      daysSinceLastDelivery: report.daysSinceLastDelivery || 0,
      alternativeWaterSource: report.alternativeWaterSource,
      alternativeSourceDetails: report.alternativeSourceDetails,
      tank: {
        tankId: matchedTank.tankId,
        tankName: matchedTank.tankName,
        waterLevelPercentage: matchedTank.waterLevelPercentage,
        capacityLiters: matchedTank.capacityLiters,
        status: matchedTank.status
      },
      priorityScore: scoring.score,
      priority: scoring.priority,
      priorityBadge: scoring.priorityBadge,
      priorityColor: scoring.priorityColor,
      breakdown: scoring.breakdown,
      urgencyFactors: scoring.urgencyFactors
    };
  });

  // Sort descending by priorityScore
  scoredVillages.sort((a, b) => b.priorityScore - a.priorityScore);

  // Assign 1-indexed rank
  return scoredVillages.map((item, index) => ({
    rank: index + 1,
    ...item
  }));
}

/**
 * Retrieves full priority detail for a single village by ID or name
 */
async function getVillagePriorityDetail(villageId) {
  const ranked = await getRankedPriorities();
  const village = ranked.find(
    v => v.villageId.toLowerCase() === villageId.toLowerCase() ||
         v.villageName.toLowerCase() === villageId.toLowerCase()
  );
  return village || null;
}

module.exports = {
  calculatePriorityScore,
  getRankedPriorities,
  getVillagePriorityDetail
};
