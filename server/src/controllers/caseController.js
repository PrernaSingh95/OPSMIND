const Case = require('../models/Case');
const AuditLog = require('../models/AuditLog');
const { orchestrateCaseWorkflow } = require('../services/agentOrchestrator');
const { logAuditEvent } = require('../services/auditService');

exports.getCases = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const filter = {};

    if (status && status.toLowerCase() !== 'all') filter.status = status;
    if (priority && priority.toLowerCase() !== 'all') filter.priority = priority;
    if (category && category.toLowerCase() !== 'all') filter.category = category;

    if (search) {
      filter.$or = [
        { caseNumber: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    const cases = await Case.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('approvalInfo.approvalId');

    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const auditTrail = await AuditLog.find({ caseId: caseItem._id }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: {
        ...caseItem.toObject(),
        auditTrail
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCase = async (req, res) => {
  try {
    const { title, description, customer, category, priority, orderId, paymentId, autoRun } = req.body;

    const count = await Case.countDocuments();
    const caseNumber = `CASE-${1000 + count + 1}`;

    const newCase = await Case.create({
      caseNumber,
      title,
      description,
      customer: customer || {
        name: 'Guest Customer',
        email: 'customer@example.com',
        customerId: 'CUST-1001'
      },
      category: category || 'Cancellation & Refund',
      priority: priority || 'Medium',
      orderId: orderId || '',
      paymentId: paymentId || '',
      createdBy: req.user?._id
    });

    await logAuditEvent({
      eventType: 'CASE_CREATED',
      caseId: newCase._id,
      caseNumber: newCase.caseNumber,
      actor: {
        userId: req.user?._id,
        name: req.user?.name || 'Customer/Employee',
        role: req.user?.role || 'User'
      },
      actionDescription: `Case ${newCase.caseNumber} created with title: "${newCase.title}"`
    });

    // If autoRun is requested (or by default for fast intake), immediately trigger orchestrator
    if (autoRun !== false) {
      const processed = await orchestrateCaseWorkflow(newCase._id, req.user);
      return res.status(201).json({ success: true, data: processed });
    }

    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processCaseWorkflow = async (req, res) => {
  try {
    const processedCase = await orchestrateCaseWorkflow(req.params.id, req.user);
    res.json({
      success: true,
      message: 'Autonomous multi-agent workflow executed successfully',
      data: { case: processedCase }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Case deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
