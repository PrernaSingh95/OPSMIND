const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  caseNumber: {
    type: String,
    required: true
  },
  caseTitle: {
    type: String,
    required: true
  },
  customer: {
    name: String,
    email: String
  },
  proposedAction: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  riskReason: {
    type: String,
    required: true
  },
  confidenceScore: {
    type: Number,
    required: true
  },
  evidenceSummary: {
    type: String,
    required: true
  },
  policyReference: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  reviewedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    role: String
  },
  reviewedAt: Date,
  reviewerNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Approval', approvalSchema);
