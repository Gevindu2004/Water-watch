const { calculatePriorityScore, getRankedPriorities, getVillagePriorityDetail } = require('../services/priorityService');
const { getNextRecommendation } = require('../services/recommendationService');
const { generateAiExplanation, getAiHealthStatus } = require('../services/aiService');
const { dispatchBowser, getResidentNotifications } = require('../services/notificationService');

async function runTests() {
  console.log('\n=============================================================');
  console.log('🧪 RUNNING COMPONENT 4 ENGINE VERIFICATION SUITE');
  console.log('=============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Test Priority Scoring for Siripura
  console.log('\n--- 1. Testing Siripura Demo Scenario Scoring ---');
  const siripuraScore = calculatePriorityScore({
    daysWithoutWater: 3,
    affectedPeople: 120,
    tankLevelPercentage: 18,
    daysSinceLastDelivery: 4,
    alternativeWaterSource: 'none'
  });

  console.log('Siripura Calculated Score:', siripuraScore.score, 'Category:', siripuraScore.priority);
  console.log('Score Breakdown:', JSON.stringify(siripuraScore.breakdown, null, 2));

  assert(siripuraScore.score === 91, `Siripura score must equal exactly 91/100 (got ${siripuraScore.score})`);
  assert(siripuraScore.priority === 'CRITICAL', `Siripura must be categorized as CRITICAL (got ${siripuraScore.priority})`);
  assert(siripuraScore.breakdown.daysWithoutWater.points === 30, 'Days without water points must be 30');
  assert(siripuraScore.breakdown.affectedPeople.points === 20, 'People affected points must be 20');
  assert(siripuraScore.breakdown.tankLevel.points === 16, 'Tank level deficit points must be 16');
  assert(siripuraScore.breakdown.daysSinceDelivery.points === 15, 'Days since delivery points must be 15');
  assert(siripuraScore.breakdown.alternativeSource.points === 10, 'No alternative source points must be 10');

  // 2. Test Priority Ranking
  console.log('\n--- 2. Testing Priority Ranking of Villages ---');
  const ranked = await getRankedPriorities();
  console.log('Ranked Villages Count:', ranked.length);
  ranked.forEach(v => {
    console.log(`Rank ${v.rank}: ${v.villageName} - Score: ${v.priorityScore} (${v.priority})`);
  });

  assert(ranked[0].villageName === 'Siripura', `Top ranked village must be Siripura (got ${ranked[0].villageName})`);
  assert(ranked[0].priorityScore === 91, `Top score must be 91 (got ${ranked[0].priorityScore})`);
  assert(ranked.length >= 4, `Ranked list must contain all demo villages (got ${ranked.length})`);

  // 3. Test Bowser Recommendation
  console.log('\n--- 3. Testing Next Bowser Recommendation ---');
  const rec = await getNextRecommendation();
  console.log('Recommendation Output:');
  console.log(JSON.stringify({
    village: rec.village,
    priorityScore: rec.priorityScore,
    priority: rec.priority,
    recommendedBowser: rec.recommendedBowser,
    capacity: rec.capacity,
    reason: rec.reason
  }, null, 2));

  assert(rec.village === 'Siripura', 'Recommended village must be Siripura');
  assert(rec.priorityScore === 91, 'Priority score must be 91');
  assert(rec.priority === 'CRITICAL', 'Priority level must be CRITICAL');
  assert(rec.recommendedBowser === 'WB-102', 'Recommended bowser must be WB-102');
  assert(rec.capacity === 5000, 'Recommended bowser capacity must be 5000 L');
  assert(rec.reason.includes('3 days') && rec.reason.includes('120 people'), 'Reason must mention 3 days and 120 people');
  assert(rec.explanation && rec.explanation.length > 50, 'Explanation narrative must be generated');

  // 4. Test AI Fallback Engine
  console.log('\n--- 4. Testing AI Fallback Safety ---');
  const fallbackTest = await generateAiExplanation({
    villageName: 'Siripura',
    priorityScore: 91,
    priority: 'CRITICAL',
    recommendedBowser: 'WB-102',
    capacity: 5000,
    daysWithoutWater: 3,
    affectedPeople: 120,
    tankLevel: 18,
    daysSinceDelivery: 4,
    alternativeWaterSource: 'none'
  });

  assert(fallbackTest.isFallback === true, 'Fallback flag should be true when no external API key is set');
  assert(fallbackTest.explanation.includes('Siripura'), 'Fallback explanation must contain village name');
  assert(fallbackTest.explanation.includes('WB-102'), 'Fallback explanation must recommend WB-102');

  // 5. Test AI Health Check
  console.log('\n--- 5. Testing AI Health Check ---');
  const health = getAiHealthStatus();
  console.log('Health status:', health);
  assert(health.status === 'healthy', 'AI health status must be healthy');
  assert(health.fallbackEngineReady === true, 'Fallback engine must be marked ready');

  // 6. Test Official Approval & Resident Dispatch Broadcast
  console.log('\n--- 6. Testing Official Approval & Resident Broadcast ---');
  const dispatchResult = await dispatchBowser({
    villageId: 'VIL-001',
    villageName: 'Siripura',
    bowserId: 'WB-102',
    capacity: 5000,
    approvedBy: 'District Secretary Polonnaruwa',
    targetEta: '2:15 PM'
  });

  console.log('Dispatch result:', dispatchResult.message);
  console.log('Resident Alert:', dispatchResult.residentAlert.message);

  assert(dispatchResult.success === true, 'Dispatch action must succeed');
  assert(dispatchResult.residentAlert.villageName === 'Siripura', 'Resident alert must target Siripura');
  assert(dispatchResult.residentAlert.eta === '2:15 PM', 'Resident alert must reflect target ETA 2:15 PM');

  const notifications = await getResidentNotifications();
  assert(notifications.length > 0, 'Notification feed must contain dispatched alert');

  console.log('\n=============================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
