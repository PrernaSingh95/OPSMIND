const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  caseNumber: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    enum: ['EMAIL', 'IN_APP_MESSAGE', 'SMS', 'SLACK_INTERNAL'],
    default: 'EMAIL'
  },
  recipient: {
    name: String,
    email: String
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PREVIEW_READY', 'SIMULATED_SENT', 'DELIVERED'],
    default: 'PREVIEW_READY'
  },
  verifiedFacts: [String],
  policyCitations: [String],
  sentAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Communication', communicationSchema);
