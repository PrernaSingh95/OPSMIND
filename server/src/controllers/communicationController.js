const Communication = require('../models/Communication');
const Case = require('../models/Case');
const { logAuditEvent } = require('../services/auditService');

exports.getCommunications = async (req, res) => {
  try {
    const { caseId } = req.query;
    const filter = {};
    if (caseId) filter.caseId = caseId;

    const comms = await Communication.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: comms.length, data: comms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendSimulatedCommunication = async (req, res) => {
  try {
    const comm = await Communication.findById(req.params.id);
    if (!comm) {
      return res.status(404).json({ success: false, message: 'Communication draft not found' });
    }

    comm.status = 'SIMULATED_SENT';
    comm.sentAt = new Date();
    await comm.save();

    await logAuditEvent({
      eventType: 'COMMUNICATION_SENT',
      caseId: comm.caseId,
      caseNumber: comm.caseNumber,
      agentName: 'Communication Agent',
      actionDescription: `Dispatched customer communication to ${comm.recipient?.email || 'recipient'} via ${comm.channel}`,
      details: {
        subject: comm.subject,
        recipient: comm.recipient
      }
    });

    res.json({ success: true, message: 'Communication sent simulated dispatch', data: comm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
