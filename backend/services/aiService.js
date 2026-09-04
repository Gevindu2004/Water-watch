const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Deterministic Backend Fallback Generator
 * Used whenever external AI API is unavailable, throttled, or unconfigured.
 * Guaranteed 100% reliability with zero crashes.
 */
function generateFallbackExplanation(data) {
  const {
    villageName = 'the target village',
    priorityScore = 91,
    priority = 'CRITICAL',
    recommendedBowser = 'WB-102',
    capacity = 5000,
    daysWithoutWater = 3,
    affectedPeople = 120,
    tankLevel = 18,
    daysSinceDelivery = 4,
    alternativeWaterSource = 'none'
  } = data;

  const altText =
    alternativeWaterSource === 'none'
      ? 'No alternative clean water sources are available in the sector.'
      : `Alternative water source is ${alternativeWaterSource}.`;

  const narrative =
    `[System Recommendation Engine (Deterministic Fallback)]\n\n` +
    `Recommended destination:\n📍 ${villageName}\n\n` +
    `Priority Score:\n${priorityScore}/100 (${priority})\n\n` +
    `Why?\n` +
    `${villageName} has experienced a ${daysWithoutWater}-day water shortage affecting approximately ${affectedPeople} people. ` +
    `The nearest storage tank is at a critical ${tankLevel}% level, and the community has not received a bowser delivery for ${daysSinceDelivery} days. ` +
    `${altText}\n\n` +
    `Recommended Action:\n` +
    `Dispatch available bowser ${recommendedBowser} (${capacity.toLocaleString()} L) to satisfy immediate drinking and sanitation demands for ${affectedPeople} residents.`;

  return {
    explanation: narrative,
    source: 'backend_fallback',
    model: 'WaterWatch-Rule-Template-Engine-v1',
    isFallback: true,
    fallbackReason: 'AI API unavailable or unconfigured (operating in deterministic fallback mode)'
  };
}

/**
 * Generates an AI-powered human-readable explanation of the recommendation.
 * NOTE: AI NEVER determines the score. The rule-based engine scores first.
 */
async function generateAiExplanation(structuredData) {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key configured, seamlessly use the robust fallback
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return generateFallbackExplanation(structuredData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
You are the AI decision explanation assistant for WaterWatch Polonnaruwa, a drought relief operations system in Sri Lanka.
Our rule-based engine has ALREADY calculated the priority score and selected the bowser.
YOUR SOLE ROLE is to explain this pre-determined decision in a clear, authoritative, operational briefing format.
DO NOT recalculate or change the score or bowser.

Here is the verified data:
- Village: ${structuredData.villageName}
- Calculated Priority Score: ${structuredData.priorityScore}/100
- Priority Category: ${structuredData.priority}
- Days Without Water: ${structuredData.daysWithoutWater} days
- Residents Affected: ${structuredData.affectedPeople} people
- Nearest Tank Level: ${structuredData.tankLevel}%
- Days Since Previous Delivery: ${structuredData.daysSinceDelivery} days
- Alternative Source: ${structuredData.alternativeWaterSource}
- Recommended Bowser: ${structuredData.recommendedBowser}
- Bowser Capacity: ${structuredData.capacity} Liters

Format your response strictly using this structure:
🤖 WATERWATCH AI

Recommended destination:
📍 [Village Name]

Priority:
[Priority Badge with emoji e.g. 🔴 CRITICAL]

Why?
[2-3 crisp operational sentences summarizing days without water, people affected, tank deficit, and lack of alternatives]

Recommended action:
[Direct dispatch directive with bowser ID, capacity, and expected impact]
`;

    // Timeout safety wrapper (5 seconds)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI API request timed out')), 5000)
    );

    const apiCallPromise = model.generateContent(prompt);
    const result = await Promise.race([apiCallPromise, timeoutPromise]);
    const responseText = result.response.text();

    return {
      explanation: responseText.trim(),
      source: 'gemini_ai',
      model: modelName,
      isFallback: false
    };
  } catch (error) {
    console.warn(`[AI Engine] Notice: External AI service error (${error.message}). Activating fallback explanation.`);
    const fallback = generateFallbackExplanation(structuredData);
    fallback.fallbackReason = `External AI call error: ${error.message}`;
    return fallback;
  }
}

/**
 * Health check for AI integration
 */
function getAiHealthStatus() {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY');

  return {
    status: 'healthy',
    aiService: hasKey ? 'online (Gemini API configured)' : 'fallback_mode (Rule-based template active)',
    model: hasKey ? (process.env.GEMINI_MODEL || 'gemini-1.5-flash') : 'WaterWatch-Rule-Template-Engine-v1',
    fallbackEngineReady: true,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  generateAiExplanation,
  generateFallbackExplanation,
  getAiHealthStatus
};
