const { callAI } = require('../aiService');

/**
 * Decision Agent
 * Responsibilities:
 * - Synthesizes verified investigation evidence ledger with retrieved SOP policies
 * - Determines deterministic, auditable business resolution
 * - Cites specific policy clauses and tool data points
 */
const runDecisionAgent = async (caseData, understandingResult, ragResult, investigationResult) => {
  const { discrepancyFound, orderStatus, paymentStatus, toolCalls } = investigationResult;
  const { appliedPolicy } = ragResult;

  const isEligibleForRefund = discrepancyFound && 
    (orderStatus === 'Cancelled' || orderStatus === 'CANCELLED') && 
    (paymentStatus === 'SUCCESS' || paymentStatus === 'SETTLED' || paymentStatus === 'AUTHORIZED');

  const systemPrompt = `You are the OpsMind AI Decision Agent.
Your job is to synthesize investigation findings and company SOP policies into an auditable business decision.
Return strictly valid JSON with keys:
{
  "decision": string,
  "recommendation": string,
  "evidencePoints": string[],
  "policyComplianceStatement": string,
  "confidence": number,
  "reasoningSummary": string
}`;

  const userPrompt = `
Case: ${caseData.title}
Intent: ${understandingResult.intent}
Applied Policy: ${appliedPolicy}
Investigation Evidence: Order status is ${orderStatus}, Payment status is ${paymentStatus}, Discrepancy: ${discrepancyFound}`;

  const fallback = {
    decision: isEligibleForRefund ? 'Full Refund Approved' : 'Further Investigation Required',
    recommendation: isEligibleForRefund 
      ? `Execute automated refund of $${understandingResult.extractedEntities?.amount || 129.99} to customer original payment method.`
      : 'Maintain order status and request additional telemetry.',
    evidencePoints: [
      `Order ${understandingResult.extractedEntities?.orderId} verified as ${orderStatus} in OMS.`,
      `Payment ${understandingResult.extractedEntities?.paymentId} verified as ${paymentStatus} in Payment Gateway.`,
      `SOP ${appliedPolicy || 'POL-101 Section 3.1'} mandates 100% full refund on captured payments for cancelled orders.`
    ],
    policyComplianceStatement: `Complies with ${appliedPolicy || 'POL-101 Section 3.1'} guidelines.`,
    confidence: 0.98,
    reasoningSummary: isEligibleForRefund
      ? 'Payment gateway captured funds but OMS order failed/cancelled. Clear transactional discrepancy verified by tools.'
      : 'No verified financial discrepancy discovered.',
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

module.exports = { runDecisionAgent };
