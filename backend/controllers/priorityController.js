const { getRankedPriorities, getVillagePriorityDetail } = require('../services/priorityService');

/**
 * GET /api/priorities
 * Retrieves active shortage reports and ranks villages with transparent scoring breakdowns
 */
async function getPriorities(req, res) {
  try {
    const ranked = await getRankedPriorities();

    const summary = {
      totalAreas: ranked.length,
      criticalAreas: ranked.filter(v => v.priority === 'CRITICAL').length,
      warningAreas: ranked.filter(v => v.priority === 'WARNING').length,
      moderateAreas: ranked.filter(v => v.priority === 'MODERATE').length,
      lowAreas: ranked.filter(v => v.priority === 'LOW').length,
      totalPeopleAffected: ranked.reduce((acc, v) => acc + (v.affectedPeople || 0), 0)
    };

    return res.status(200).json({
      success: true,
      summary,
      priorities: ranked
    });
  } catch (error) {
    console.error('Error fetching priorities:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate and retrieve priorities',
      error: error.message
    });
  }
}

/**
 * GET /api/priorities/:villageId
 * Retrieves deep scoring factors for a specific village
 */
async function getPriorityByVillage(req, res) {
  try {
    const { villageId } = req.params;
    const village = await getVillagePriorityDetail(villageId);

    if (!village) {
      return res.status(404).json({
        success: false,
        message: `Village with ID or name "${villageId}" not found in active shortage registry.`
      });
    }

    return res.status(200).json({
      success: true,
      data: village
    });
  } catch (error) {
    console.error('Error fetching village priority detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve village priority detail',
      error: error.message
    });
  }
}

module.exports = {
  getPriorities,
  getPriorityByVillage
};
