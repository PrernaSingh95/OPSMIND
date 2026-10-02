const Case = require('../models/Case');
const Approval = require('../models/Approval');
const { runUnderstandingAgent } = require('./agents/understandingAgent');
const { runRAGKnowledgeAgent } = require('./agents/ragKnowledgeAgent');
const { runInvestigationAgent } = require('./agents/investigationAgent');
const { runDecisionAgent } = require('./agents/decisionAgent');
const { runRiskCheckAgent } = require('./agents/riskCheckAgent');
const { runActionAgent } = require('./agents/actionAgent');
const { runCommunicationAgent } = require('./agents/communicationAgent');
const { logAuditEvent } = require('./auditService');

/**
 * OpsMind AI Autonomous Pipeline Orchestrator
 * Sequentially invokes each specialized agent, passes context, executes guardrails,
 * persists evidence state, and creates audit records.
 */
const orchestrateCaseWorkflow = async (caseId, triggeredByUser = null) => {
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) {
    throw new Error('Case not found');
  }

  const startTime = Date.now();
  caseDoc.workflowState.isProcessing = true;
  await caseDoc.save();

  try {
    // 1. Log Workflow Triggered
    await logAuditEvent({
      eventType: 'WORKFLOW_TRIGGERED',
      caseId: caseDoc._id,
      caseNumber: caseDoc.caseNumber,
      agentName: 'System',
      actionDescription: `Autonomous pipeline orchestration started for ${caseDoc.caseNumber}`
    });

    // 2. Step 1: Understanding Agent
    caseDoc.workflowState.currentStep = 'Understanding';
    const understandingResult = await runUnderstandingAgent(caseDoc);
    caseDoc.understandingResult = understandingResult;
    if (!caseDoc.workflowState.completedSteps.includes('Understanding')) {
      caseDoc.workflowState.completedSteps.push('Understanding');
    }
    await logAuditEvent({
      eventType: 'UNDERSTANDING_COMPLETED',
      caseId: caseDoc._id,
      caseNumber: caseDoc.caseNumber,
      agentName: 'Understanding Agent',
      actionDescription: `Extracted intent: "${understandingResult.intent}" with urgency ${understandingResult.urgency}`,
      details: understandingResult
    });

    // 3. Step 2: RAG Knowledge Agent
    caseDoc.workflowState.currentStep = 'KnowledgeRetrieval';
    const ragResult = await runRAGKnowledgeAgent(caseDoc, understandingResult);
    caseDoc.ragResult = ragResult;
    if (!caseDoc.workflowState.completedSteps.includes('KnowledgeRetrieval')) {
      caseDoc.workflowState.completedSteps.push('KnowledgeRetrieval');
    }
    await logAuditEvent({
      eventType: 'RAG_RETRIEVED',
      caseId: caseDoc._id,
      caseNumber: caseDoc.caseNumber,
      agentName: 'RAG Knowledge Agent',
      actionDescription: `Grounding against ${ragResult.appliedPolicy || 'Knowledge Base'}`,
      details: ragResult
    });

    // 4. Step 3: Investigation Agent (Mock Tools)
    caseDoc.workflowState.currentStep = 'Investigation';
    const investigationResult = await runInvestigationAgent(caseDoc, understandingResult);
    caseDoc.investigationResult = investigationResult;
    if (!caseDoc.workflowState.completedSteps.includes('Investigation')) {
      caseDoc.workflowState.completedSteps.push('Investigation');
    }
    await logAuditEvent({
      eventType: 'INVESTIGATION_COMPLETED',
      caseId: caseDoc._id,
      caseNumber: caseDoc.caseNumber,
      agentName: 'Investigation Agent',
      actionDescription: `Queried OMS and PG. Discrepancy Found: ${investigationResult.discrepancyFound}`,
      details: investigationResult
    });

    // 5. Step 4: Decision Agent
    caseDoc.workflowState.currentStep = 'Decision';
    const decisionResult = await runDecisionAgent(caseDoc, understandingResult, ragResult, investigationResult);
    caseDoc.decisionResult = decisionResult;
    if (!caseDoc.workflowState.completedSteps.includes('Decision')) {
      caseDoc.workflowState.completedSteps.push('Decision');
    }
    await logAuditEvent({
      eventType: 'DECISION_CREATED',
      caseId: caseDoc._id,
      caseNumber: caseDoc.caseNumber,
      agentName: 'Decision Agent',
      actionDescription: `Decision: ${decisionResult.decision}`,
      details: decisionResult
    });

    // 6. Step 5: Risk Check Agent
    caseDoc.workflowState.currentStep = 'RiskCheck';
    const riskCheckResult = await runRiskCheckAgent(caseDoc, decisionResult, investigationResult, understandingResult);
    caseDoc.riskCheckResult = riskCheckResult;
    if (!caseDoc.workflowState.completedSteps.includes('RiskCheck')) {
      caseDoc.workflowState.completedSteps.push('RiskCheck');
    }
    await logAuditEvent({
      eventType: 'RISK_CHECK_COMPLETED',
      caseId: caseDoc._id,
      caseNumber: caseDoc.caseNumber,
      agentName: 'Risk Check Agent',
      actionDescription: `Risk evaluated as ${riskCheckResult.riskLevel}. Approval Required: ${riskCheckResult.requiresApproval}`,
      details: riskCheckResult
    });

    // 7. Step 6: Action Execution OR Human Approval Registration
    caseDoc.workflowState.currentStep = 'HumanApproval';
    const actionResult = await runActionAgent(caseDoc, decisionResult, riskCheckResult);
    caseDoc.actionResult = actionResult;
    if (!caseDoc.workflowState.completedSteps.includes('HumanApproval')) {
      caseDoc.workflowState.completedSteps.push('HumanApproval');
    }

    if (riskCheckResult.requiresApproval) {
      // Register Human Approval item
      caseDoc.status = 'Awaiting Approval';
      let approval = await Approval.findOne({ caseId: caseDoc._id, status: 'PENDING' });
      if (!approval) {
        approval = await Approval.create({
          caseId: caseDoc._id,
          caseNumber: caseDoc.caseNumber,
          caseTitle: caseDoc.title,
          customer: caseDoc.customer,
          proposedAction: decisionResult.recommendation || decisionResult.decision,
          riskLevel: riskCheckResult.riskLevel,
          riskReason: riskCheckResult.riskFactors?.join(', ') || 'Exceeds autonomous threshold limit',
          confidenceScore: decisionResult.confidence || 0.95,
          evidenceSummary: investigationResult.evidenceSummary || 'OMS/PG tool discrepancy detected',
          policyReference: ragResult.policyReference || 'POL-101'
        });
      }
      caseDoc.approvalInfo = {
        approvalId: approval._id,
        status: 'PENDING',
        requestedAt: new Date()
      };

      await logAuditEvent({
        eventType: 'APPROVAL_REQUESTED',
        caseId: caseDoc._id,
        caseNumber: caseDoc.caseNumber,
        agentName: 'Action Agent',
        actionDescription: `Dispatched to Human Manager queue. Proposed: ${decisionResult.decision}`,
        details: approval
      });
    } else {
      caseDoc.status = 'Resolved';
      await logAuditEvent({
        eventType: 'ACTION_EXECUTED',
        caseId: caseDoc._id,
        caseNumber: caseDoc.caseNumber,
        agentName: 'Action Agent',
        actionDescription: actionResult.actionSummary,
        details: actionResult
      });
    }

    // 8. Step 7: Communication Agent
    caseDoc.workflowState.currentStep = 'Communication';
    const communicationResult = await runCommunicationAgent(caseDoc, decisionResult, actionResult, understandingResult);
    caseDoc.communicationResult = communicationResult;
    if (!caseDoc.workflowState.completedSteps.includes('Communication')) {
      caseDoc.workflowState.completedSteps.push('Communication');
    }
    await logAuditEvent({
      eventType: 'COMMUNICATION_GENERATED',
      caseId: caseDoc._id,
      caseNumber: caseDoc.caseNumber,
      agentName: 'Communication Agent',
      actionDescription: `Customer draft prepared for ${caseDoc.customer?.email}`,
      details: communicationResult
    });

    // 9. Pipeline Completed
    caseDoc.workflowState.currentStep = 'Completed';
    caseDoc.workflowState.isProcessing = false;
    caseDoc.workflowState.lastUpdated = new Date();
    caseDoc.metrics.totalDurationMs = Date.now() - startTime;
    await caseDoc.save();

    return caseDoc;
  } catch (err) {
    caseDoc.workflowState.isProcessing = false;
    await caseDoc.save();
    throw err;
  }
};

module.exports = { orchestrateCaseWorkflow };
