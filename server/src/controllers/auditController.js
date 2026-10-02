const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
  try {
    const { agent, search, caseId } = req.query;
    const filter = {};

    if (agent && agent !== 'All') {
      filter.$or = [
        { agentName: agent },
        { 'actor.name': agent },
        { eventType: { $regex: agent, $options: 'i' } }
      ];
    }
    if (caseId) filter.caseId = caseId;
    if (search) {
      filter.$or = [
        { actionDescription: { $regex: search, $options: 'i' } },
        { caseNumber: { $regex: search, $options: 'i' } },
        { eventType: { $regex: search, $options: 'i' } }
      ];
    }

    const logs = await AuditLog.find(filter)
      .populate('caseId', 'caseNumber title')
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
