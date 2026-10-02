const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: [
      'CASE_CREATED',
      'WORKFLOW_TRIGGERED',
      'UNDERSTANDING_COMPLETED',
      'RAG_RETRIEVED',
      'INVESTIGATION_COMPLETED',
      'DECISION_CREATED',
      'RISK_CHECK_COMPLETED',
      'APPROVAL_REQUESTED',
      'ACTION_APPROVED',
      'ACTION_REJECTED',
      'ACTION_EXECUTED',
      'COMMUNICATION_GENERATED',
      'COMMUNICATION_SENT',
      'PROMPT_OPTIMIZED',
      'EVALUATION_RUN',
      'SYSTEM_CONFIG_UPDATED'
    ],
    required: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  caseNumber: String,
  agentName: {
    type: String,
    enum: [
      'System',
      'Case Intake',
      'Understanding Agent',
      'RAG Knowledge Agent',
      'Investigation Agent',
      'Decision Agent',
      'Risk Check Agent',
      'Action Agent',
      'Communication Agent',
      'Human Reviewer',
      'Evaluation Engine'
    ],
    default: 'System'
  },
  actor: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'OpsMind Autonomous Engine' },
    role: { type: String, default: 'AI Agent' }
  },
  actionDescription: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'WARNING', 'FAILURE', 'INFO'],
    default: 'SUCCESS'
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

auditLogSchema.index({ eventType: 1, caseNumber: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
