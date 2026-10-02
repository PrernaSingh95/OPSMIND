const AuditLog = require('../models/AuditLog');

/**
 * Audit Logging Service
 * Records structured, immutable audit log events across the OpsMind multi-agent workflow.
 */
const logAuditEvent = async ({
  eventType,
  caseId,
  caseNumber,
  agentName = 'System',
  actor = { name: 'OpsMind Autonomous Engine', role: 'AI Agent' },
  actionDescription,
  details = {},
  status = 'SUCCESS'
}) => {
  try {
    const log = await AuditLog.create({
      eventType,
      caseId,
      caseNumber,
      agentName,
      actor,
      actionDescription,
      details,
      status,
      timestamp: new Date()
    });
    return log;
  } catch (error) {
    console.error('Audit logging failed:', error.message);
    return null;
  }
};

module.exports = { logAuditEvent };
