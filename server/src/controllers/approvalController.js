const Approval = require('../models/Approval');
const Case = require('../models/Case');
const { logAuditEvent } = require('../services/auditService');

exports.getApprovals = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status.toUpperCase();
    }

    const approvals = await Approval.find(filter)
      .populate('caseId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: approvals.length, data: approvals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.decideApproval = async (req, res) => {
  try {
    const { decision, reviewerNotes } = req.body; // 'Approved' | 'Rejected'
    const approval = await Approval.findById(req.params.id);

    if (!approval) {
      return res.status(404).json({ success: false, message: 'Approval record not found' });
    }

    const isApproved = decision.toUpperCase() === 'APPROVED';
    approval.status = isApproved ? 'APPROVED' : 'REJECTED';
    approval.reviewedBy = {
      userId: req.user?._id,
      name: req.user?.name || 'Operations Manager',
      email: req.user?.email || 'manager@opsmind.ai',
      role: req.user?.role || 'Manager'
    };
    approval.reviewedAt = new Date();
    approval.reviewerNotes = reviewerNotes || `Decision: ${decision}`;
    await approval.save();

    // Update parent Case
    const targetCase = await Case.findById(approval.caseId);
    if (targetCase) {
      targetCase.status = isApproved ? 'Resolved' : 'Escalated';
      if (targetCase.actionResult) {
        targetCase.actionResult.actionStatus = isApproved ? 'EXECUTED' : 'REJECTED';
        targetCase.actionResult.actionSummary = isApproved
          ? `Human Approval Granted: ${approval.proposedAction}`
          : `Human Approval Denied: ${reviewerNotes || 'Rejected by reviewer'}`;
      }
      targetCase.approvalInfo = {
        approvalId: approval._id,
        status: isApproved ? 'APPROVED' : 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: req.user?.name || 'Operations Manager',
        reviewComments: reviewerNotes
      };
      await targetCase.save();
    }

    await logAuditEvent({
      eventType: isApproved ? 'ACTION_APPROVED' : 'ACTION_REJECTED',
      caseId: approval.caseId,
      caseNumber: approval.caseNumber,
      agentName: 'Human Reviewer',
      actor: {
        userId: req.user?._id,
        name: req.user?.name || 'Operations Manager',
        role: req.user?.role || 'Manager'
      },
      actionDescription: `Manager ${isApproved ? 'Approved' : 'Rejected'} proposed action: "${approval.proposedAction}"`,
      details: { reviewerNotes, decision }
    });

    res.json({ success: true, message: `Approval ${decision.toLowerCase()} successfully`, data: approval });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
