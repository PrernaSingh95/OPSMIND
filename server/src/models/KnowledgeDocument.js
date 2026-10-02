const mongoose = require('mongoose');

const knowledgeDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  policyCode: {
    type: String,
    default: function() {
      return 'POL-' + Math.floor(1000 + Math.random() * 9000);
    }
  },
  category: {
    type: String,
    enum: ['Billing & Payments', 'Orders & Logistics', 'Compliance & Escalations', 'Customer Support', 'General'],
    default: 'Billing & Payments'
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  embeddingVector: {
    type: [Number],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

knowledgeDocumentSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);
