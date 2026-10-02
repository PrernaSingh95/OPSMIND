/**
 * Action Agent
 * Responsibilities:
 * - Executes automated remedies if risk check passes (Auto-Executable)
 * - If requires human approval, registers approval queue entry
 * - Dispatches simulated mutations to mock gateways / inventory
 */
const runActionAgent = async (caseData, decisionResult, riskCheckResult) => {
  if (riskCheckResult.requiresApproval) {
    return {
      actionType: 'ESCALATE_TO_HUMAN_APPROVAL',
      actionStatus: 'PENDING',
      actionSummary: `Case exceeds autonomous threshold. Routed to Human Manager Approval queue for ${decisionResult.decision}.`,
      isMockAction: true,
      mockTransactionRef: 'QUEUE-HITL-' + Math.floor(1000 + Math.random() * 9000),
      executedAt: new Date()
    };
  }

  // Execute Low-Risk Automated Action
  const refundRef = 'REFUND-AUTO-' + Math.floor(10000 + Math.random() * 90000);

  return {
    actionType: 'PROCESS_AUTO_REFUND',
    actionStatus: 'EXECUTED',
    actionSummary: `Autonomous remedy executed: Dispatched refund for case ${caseData.caseNumber} to Payment Gateway. Ref: ${refundRef}.`,
    isMockAction: true,
    mockTransactionRef: refundRef,
    executedAt: new Date()
  };
};

module.exports = { runActionAgent };
