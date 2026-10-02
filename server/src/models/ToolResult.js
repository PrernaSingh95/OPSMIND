const mongoose = require('mongoose');

const toolResultSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  toolName: {
    type: String,
    required: true
  },
  inputParams: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  outputData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'NOT_FOUND', 'ERROR'],
    default: 'SUCCESS'
  },
  executionTimeMs: {
    type: Number,
    default: 120
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ToolResult', toolResultSchema);
