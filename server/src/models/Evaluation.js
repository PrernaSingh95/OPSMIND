const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  testSuiteName: {
    type: String,
    required: true,
    default: 'OpsMind Standard Operations Benchmark v1'
  },
  runBy: {
    type: String,
    default: 'Automated CI/CD Evaluator'
  },
  evaluatedAt: {
    type: Date,
    default: Date.now
  },
  datasetSize: {
    type: Number,
    default: 25
  },
  overallMetrics: {
    taskSuccessRate: { type: Number, required: true }, // %
    groundednessScore: { type: Number, required: true }, // %
    correctToolUseRate: { type: Number, required: true }, // %
    escalationCorrectness: { type: Number, required: true }, // %
    avgLatencyMs: { type: Number, required: true },
    avgCostUSD: { type: Number, required: true },
    failureRate: { type: Number, default: 4.0 }
  },
  testCases: [{
    caseId: String,
    scenarioTitle: String,
    expectedIntent: String,
    expectedAction: String,
    expectedRiskLevel: String,
    actualIntent: String,
    actualAction: String,
    actualRiskLevel: String,
    passed: Boolean,
    groundedness: Number,
    toolSelectionMatch: Boolean,
    latencyMs: Number,
    notes: String
  }],
  status: {
    type: String,
    enum: ['COMPLETED', 'RUNNING', 'FAILED'],
    default: 'COMPLETED'
  },
  isSimulatedData: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
