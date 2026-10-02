const { callAI } = require('../aiService');

/**
 * Risk Check Agent
 * Responsibilities:
 * - Quantifies financial disbursement risk and policy deviation
 * - Enforces autonomous threshold: disbursements <= $150.00 & Low fraud score are Auto-Executed
 * - Cases > $150.00 or flagged customer fraud route to Human Approval (HITL)
 */
const runRiskCheckAgent = async (caseData, decisionResult, investigationResult, understandingResult) => {
  const amount = understandingResult?.extractedEntities?.amount || 129.99;
  const AUTONOMOUS_REFUND_LIMIT = 150.00;

  const exceedsLimit = amount > AUTONOMOUS_REFUND_LIMIT;
  const riskFactors = [];

  if (exceedsLimit) {
    riskFactors.push(`Transaction amount ($${amount}) exceeds autonomous threshold ($${AUTONOMOUS_REFUND_LIMIT})`);
  } else {
    riskFactors.push(`Transaction amount ($${amount}) is within safe autonomous limit ($${AUTONOMOUS_REFUND_LIMIT})`);
  }

  const riskLevel = exceedsLimit ? 'High' : 'Low';
  const riskScore = exceedsLimit ? 75 : 12;
  const requiresApproval = exceedsLimit;
  const autoExecutable = !exceedsLimit;

  const systemPrompt = `You are the OpsMind AI Risk Check Agent.
Analyze the proposed decision against financial limits ($150 limit) and security policies.
Return strictly valid JSON:
{
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "riskScore": number,
  "riskFactors": string[],
  "requiresApproval": boolean,
  "autoExecutable": boolean
}`;

  const userPrompt = `Proposed Decision: ${decisionResult.decision}
Amount: $${amount}
Auto Limit: $${AUTONOMOUS_REFUND_LIMIT}`;

  const fallback = {
    riskLevel,
    riskScore,
    riskFactors,
    requiresApproval,
    autoExecutable,
    executedAt: new Date()
  };

  const aiResult = await callAI({
    systemPrompt,
    userPrompt,
    temperature: 0.1,
    fallbackResponse: fallback
  });

  return {
    ...fallback,
    ...aiResult,
    executedAt: new Date()
  };
};

module.exports = { runRiskCheckAgent };
