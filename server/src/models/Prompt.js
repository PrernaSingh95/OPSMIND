const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  agentName: {
    type: String,
    enum: [
      'Understanding Agent',
      'RAG Knowledge Agent',
      'Investigation Agent',
      'Decision Agent',
      'Risk Check Agent',
      'Action Agent',
      'Communication Agent'
    ],
    required: true
  },
  promptVersion: {
    type: String,
    required: true
  }, // e.g. "v1.0", "v2.0", "v3.0"
  description: {
    type: String,
    required: true
  },
  systemPrompt: {
    type: String,
    required: true
  },
  userPromptTemplate: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    default: 0.1
  },
  status: {
    type: String,
    enum: ['Active', 'Experimental', 'Archived'],
    default: 'Active'
  },
  benchmarkScores: {
    taskSuccessRate: { type: Number, default: 94.0 },
    groundednessScore: { type: Number, default: 96.0 },
    toolSelectionAccuracy: { type: Number, default: 98.0 },
    avgLatencyMs: { type: Number, default: 320 },
    estimatedCostPerCaseUSD: { type: Number, default: 0.0035 }
  },
  critiqueNotes: {
    type: String,
    default: 'Structured JSON enforcement, zero-hallucination policy guardrails enabled.'
  },
  createdBy: {
    type: String,
    default: 'Lead AI Engineer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

promptSchema.index({ agentName: 1, promptVersion: 1 });

module.exports = mongoose.model('Prompt', promptSchema);
