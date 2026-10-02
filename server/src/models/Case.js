const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    customerId: { type: String, default: 'CUST-1001' }
  },
  category: {
    type: String,
    enum: ['Billing & Payments', 'Order Management', 'Cancellation & Refund', 'Account & Access', 'Technical Issue', 'General Inquiry'],
    default: 'Cancellation & Refund'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['New', 'Processing', 'Awaiting Approval', 'Resolved', 'Escalated', 'Closed'],
    default: 'New'
  },
  orderId: {
    type: String,
    default: ''
  },
  paymentId: {
    type: String,
    default: ''
  },
  
  // Agent Workflow Execution State
  workflowState: {
    currentStep: {
      type: String,
      enum: ['Intake', 'Understanding', 'KnowledgeRetrieval', 'Investigation', 'Decision', 'RiskCheck', 'HumanApproval', 'ActionExecution', 'Communication', 'Completed'],
      default: 'Intake'
    },
    completedSteps: [{
      type: String
    }],
    isProcessing: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // 1. Understanding Agent Output
  understandingResult: {
    intent: String,
    urgency: String,
    sentiment: String,
    extractedEntities: {
      orderId: String,
      paymentId: String,
      amount: Number,
      issueType: String
    },
    suggestedCategory: String,
    confidence: Number,
    executedAt: Date
  },

  // 2. RAG Knowledge Retrieval Result
  ragResult: {
    retrievedDocuments: [{
      docId: { type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeDocument' },
      title: String,
      policyCode: String,
      category: String,
      relevantExcerpt: String,
      relevanceScore: Number
    }],
    appliedPolicy: String,
    policyReference: String,
    executedAt: Date
  },

  // 3. Investigation Agent Result
  investigationResult: {
    toolCalls: [{
      toolName: String,
      endpoint: String,
      status: String,
      data: mongoose.Schema.Types.Mixed
    }],
    orderVerified: Boolean,
    paymentVerified: Boolean,
    orderStatus: String,
    paymentStatus: String,
    evidenceSummary: String,
    discrepancyFound: Boolean,
    executedAt: Date
  },

  // 4. Decision Agent Result
  decisionResult: {
    decision: String,
    recommendation: String,
    evidencePoints: [String],
    policyComplianceStatement: String,
    confidence: Number,
    reasoningSummary: String,
    executedAt: Date
  },

  // 5. Risk Check Agent Result
  riskCheckResult: {
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low'
    },
    riskScore: Number, // 0-100
    riskFactors: [String],
    requiresApproval: {
      type: Boolean,
      default: false
    },
    autoExecutable: {
      type: Boolean,
      default: true
    },
    executedAt: Date
  },

  // 6. Action Execution Result
  actionResult: {
    actionType: String,
    actionStatus: {
      type: String,
      enum: ['PENDING', 'EXECUTED', 'SKIPPED', 'REJECTED'],
      default: 'PENDING'
    },
    actionSummary: String,
    isMockAction: {
      type: Boolean,
      default: true
    },
    mockTransactionRef: String,
    executedAt: Date
  },

  // 7. Communication Agent Result
  communicationResult: {
    recipientEmail: String,
    subject: String,
    body: String,
    tone: String,
    isSimulatedSent: {
      type: Boolean,
      default: false
    },
    verifiedFactsUsed: [String],
    policyCitations: [String],
    generatedAt: Date
  },

  // Approval Information
  approvalInfo: {
    approvalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Approval' },
    status: {
      type: String,
      enum: ['NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED'],
      default: 'NOT_REQUIRED'
    },
    requestedAt: Date,
    reviewedAt: Date,
    reviewedBy: String,
    reviewComments: String
  },

  // Evaluation & Operational Metrics
  metrics: {
    totalDurationMs: { type: Number, default: 0 },
    estimatedCostUSD: { type: Number, default: 0.0042 },
    groundednessScore: { type: Number, default: 96.5 },
    accuracyScore: { type: Number, default: 98.0 }
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Indexes for fast lookup and filtering
caseSchema.index({ caseNumber: 1, status: 1, priority: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('Case', caseSchema);
