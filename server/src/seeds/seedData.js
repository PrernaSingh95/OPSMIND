const mongoose = require('mongoose');
const User = require('../models/User');
const KnowledgeDocument = require('../models/KnowledgeDocument');
const MockOrder = require('../models/MockOrder');
const MockPayment = require('../models/MockPayment');
const MockCustomer = require('../models/MockCustomer');
const Prompt = require('../models/Prompt');
const Evaluation = require('../models/Evaluation');
const Case = require('../models/Case');
const Approval = require('../models/Approval');
const AuditLog = require('../models/AuditLog');
const Communication = require('../models/Communication');
const connectDB = require('../config/db');

async function seedDatabase(exitOnComplete = true) {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Connecting to database for seeding...');
      await connectDB();
    }


    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      KnowledgeDocument.deleteMany({}),
      MockOrder.deleteMany({}),
      MockPayment.deleteMany({}),
      MockCustomer.deleteMany({}),
      Prompt.deleteMany({}),
      Evaluation.deleteMany({}),
      Case.deleteMany({}),
      Approval.deleteMany({}),
      AuditLog.deleteMany({}),
      Communication.deleteMany({})
    ]);

    // 1. Seed RBAC Users
    console.log('Seeding RBAC Users...');
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'admin@opsmind.ai',
        password: 'Admin@123',
        role: 'Admin',
        department: 'Executive Governance'
      },
      {
        name: 'Operations Manager',
        email: 'manager@opsmind.ai',
        password: 'Manager@123',
        role: 'Manager',
        department: 'Operations & Escalations'
      },
      {
        name: 'Support Employee',
        email: 'employee@opsmind.ai',
        password: 'Employee@123',
        role: 'Employee',
        department: 'Customer Tier 1 Triage'
      }
    ]);
    const adminUser = users[0];

    // 2. Seed RAG Knowledge Base Documents
    console.log('Seeding Knowledge Base Documents...');
    await KnowledgeDocument.create([
      {
        title: 'Payment Failure & Auto-Refund SOP',
        policyCode: 'POL-101',
        category: 'Billing & Payments',
        content: 'Section 3.1: When payment deduction is verified on Payment Gateway (status=SUCCESS/SETTLED) but the corresponding Order is marked as CANCELLED or FAILED in OMS, the customer is entitled to a 100% full refund to original payment source.\nSection 3.2: For transactions under $150.00 USD with zero fraud flags, autonomous execution is permitted immediately. Transactions exceeding $150.00 USD require Human Manager Approval (HITL).\nSection 3.3: Processing timeline for card refunds is 3-5 business days.',
        tags: ['payment', 'refund', 'cancellation', 'gateway', 'discrepancy'],
        isActive: true
      },
      {
        title: 'Order Cancellation & Compensation Policy',
        policyCode: 'POL-102',
        category: 'Orders & Logistics',
        content: 'Section 1.4: Orders cancelled prior to fulfillment due to inventory depletion or gateway timeouts must trigger immediate customer notification and unlock reserved inventory.\nSection 1.5: If cancellation was caused by internal system latency after payment capture, issue a $10.00 courtesy credit in addition to full refund.',
        tags: ['order', 'cancellation', 'inventory', 'compensation'],
        isActive: true
      },
      {
        title: 'High-Risk Escalation & Fraud SOP',
        policyCode: 'POL-103',
        category: 'Compliance & Escalations',
        content: 'Section 4.1: Any customer account with a Fraud Risk Score exceeding 40 points, or showing duplicate claim velocity > 3 in 7 days, must be immediately escalated to Senior Risk Review.\nSection 4.2: Never execute automated disbursements on flagged accounts without two-person authorization.',
        tags: ['fraud', 'risk', 'escalation', 'compliance', 'security'],
        isActive: true
      },
      {
        title: 'Customer Communication & Tone Guidelines',
        policyCode: 'POL-104',
        category: 'Customer Support',
        content: 'Guideline 2.0: Customer communication must always be empathetic, concise, and professional.\nGuideline 2.1: Explicitly specify the refund amount, transaction reference, and bank credit timeline (3-5 business days).\nGuideline 2.2: Do NOT expose internal technical reasoning, system prompt rules, or backend stack traces.',
        tags: ['communication', 'tone', 'support', 'guidelines'],
        isActive: true
      }
    ]);

    // 3. Seed Mock Business Tools (OMS, PG, CRM)
    console.log('Seeding Mock Business Sandbox...');
    await MockCustomer.create([
      { customerId: 'CUST-104', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', tier: 'GOLD', orderCount: 8, lifetimeSpend: 1450.0, riskScore: 8, totalCases: 2 },
      { customerId: 'CUST-202', name: 'David Miller', email: 'david.miller@example.com', tier: 'STANDARD', orderCount: 3, lifetimeSpend: 320.0, riskScore: 12, totalCases: 1 },
      { customerId: 'CUST-305', name: 'Alex Rivera', email: 'alex.rivera@example.com', tier: 'PLATINUM', orderCount: 19, lifetimeSpend: 4890.0, riskScore: 5, totalCases: 3 }
    ]);

    await MockOrder.create([
      { orderId: 'ORD-9821', customerId: 'CUST-104', totalAmount: 129.99, status: 'CANCELLED', items: [{ name: 'Wireless Noise-Canceling Headphones', quantity: 1, price: 129.99 }] },
      { orderId: 'ORD-7712', customerId: 'CUST-202', totalAmount: 49.99, status: 'DELIVERED', items: [{ name: 'Ergonomic Desk Mat', quantity: 1, price: 49.99 }] },
      { orderId: 'ORD-3310', customerId: 'CUST-305', totalAmount: 310.00, status: 'CANCELLED', items: [{ name: '4K Ultra Gaming Monitor', quantity: 1, price: 310.00 }] }
    ]);

    await MockPayment.create([
      { paymentId: 'TXN-4921', orderId: 'ORD-9821', customerId: 'CUST-104', amount: 129.99, currency: 'USD', status: 'SUCCESS', method: 'CREDIT_CARD', gatewayTransactionRef: 'txn_mock_stripe_9821' },
      { paymentId: 'TXN-8812', orderId: 'ORD-7712', customerId: 'CUST-202', amount: 49.99, currency: 'USD', status: 'SUCCESS', method: 'DEBIT_CARD', gatewayTransactionRef: 'txn_mock_stripe_7712' },
      { paymentId: 'TXN-9910', orderId: 'ORD-3310', customerId: 'CUST-305', amount: 310.00, currency: 'USD', status: 'SUCCESS', method: 'CREDIT_CARD', gatewayTransactionRef: 'txn_mock_stripe_9910' }
    ]);


    // 4. Seed Prompt Registry
    console.log('Seeding Prompt Registry...');
    await Prompt.create([
      {
        agentName: 'Understanding Agent',
        promptVersion: 'v3.0',
        description: 'Structured Triage & Entity Parser v3.0 with zero-hallucination regex grounding.',
        systemPrompt: 'You are the OpsMind AI Understanding Agent. Extract operational intent, assess urgency, and extract key entities in strict JSON.',
        userPromptTemplate: 'Case Title: {title}\nCase Description: {description}\nCategory: {category}\nOrder ID: {orderId}',
        status: 'Active',
        benchmarkScores: { taskSuccessRate: 98.2, groundednessScore: 97.4, toolSelectionAccuracy: 99.0, avgLatencyMs: 240, estimatedCostPerCaseUSD: 0.002 }
      },
      {
        agentName: 'Decision Agent',
        promptVersion: 'v3.0',
        description: 'Chain-of-Evidence Reasoning Engine v3.0 with policy citations.',
        systemPrompt: 'You are the OpsMind AI Decision Agent. Synthesize verified tool evidence with retrieved SOP policy to output auditable business decisions.',
        userPromptTemplate: 'Case: {title}\nIntent: {intent}\nPolicy: {appliedPolicy}\nInvestigation: {evidenceSummary}',
        status: 'Active',
        benchmarkScores: { taskSuccessRate: 96.8, groundednessScore: 98.1, toolSelectionAccuracy: 97.5, avgLatencyMs: 310, estimatedCostPerCaseUSD: 0.003 }
      },
      {
        agentName: 'Communication Agent',
        promptVersion: 'v3.0',
        description: 'Customer Safety & Brand Voice Generator v3.0.',
        systemPrompt: 'You are the OpsMind AI Customer Communication Agent. Draft empathetic, customer-friendly resolution email without leaking internal technical logs.',
        userPromptTemplate: 'Customer: {name}\nOrder: {orderId}\nResolution: {decision}\nAction: {actionSummary}',
        status: 'Active',
        benchmarkScores: { taskSuccessRate: 99.1, groundednessScore: 98.5, toolSelectionAccuracy: 99.2, avgLatencyMs: 280, estimatedCostPerCaseUSD: 0.0025 }
      }
    ]);

    // 5. Seed Benchmark Evaluation Metrics
    console.log('Seeding Benchmark Suite...');
    await Evaluation.create({
      testSuiteName: 'OpsMind Standard Operations Benchmark v1',
      evaluatedAt: new Date(),
      datasetSize: 25,
      overallMetrics: {
        taskSuccessRate: 96.4,
        groundednessScore: 95.8,
        correctToolUseRate: 98.2,
        escalationCorrectness: 94.0,
        avgLatencyMs: 1420,
        avgCostUSD: 0.0042,
        failureRate: 1.8
      },
      testCases: [
        { scenarioTitle: 'Payment Deducted, Order Cancelled ($129.99)', expectedIntent: 'PaymentDiscrepancy', expectedAction: 'AutoRefund', expectedRiskLevel: 'Low', passed: true, groundedness: 98, toolSelectionMatch: true, latencyMs: 1200 },
        { scenarioTitle: 'High-Value Cancelled Order ($310.00)', expectedIntent: 'PaymentDiscrepancy', expectedAction: 'EscalateHITL', expectedRiskLevel: 'High', passed: true, groundedness: 96, toolSelectionMatch: true, latencyMs: 1450 },
        { scenarioTitle: 'Damaged Goods Return Request', expectedIntent: 'ReturnRequest', expectedAction: 'AutoReturnLabel', expectedRiskLevel: 'Low', passed: true, groundedness: 95, toolSelectionMatch: true, latencyMs: 1100 },
        { scenarioTitle: 'Account Security Takeover Flag', expectedIntent: 'FraudAlert', expectedAction: 'EscalateFraud', expectedRiskLevel: 'High', passed: true, groundedness: 99, toolSelectionMatch: true, latencyMs: 950 },
        { scenarioTitle: 'Duplicate Charge On Subscription', expectedIntent: 'DuplicateCharge', expectedAction: 'AutoRefund', expectedRiskLevel: 'Low', passed: true, groundedness: 97, toolSelectionMatch: true, latencyMs: 1050 }
      ]
    });

    // 6. Seed Cases including the Main Demo Case
    console.log('Seeding Demo Cases...');
    const demoCase = await Case.create({
      caseNumber: 'CASE-1001',
      title: 'Payment was deducted but my order was cancelled.',
      description: 'I placed an order for Wireless Headphones (Order #ORD-9821, Payment Ref: TXN-4921). My Visa card was charged $129.99, but the website shows the order was cancelled immediately. Please refund my money.',
      customer: {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@example.com',
        customerId: 'CUST-104'
      },
      category: 'Billing & Payments',
      priority: 'High',
      status: 'Resolved',
      orderId: 'ORD-9821',
      paymentId: 'TXN-4921',
      workflowState: {
        currentStep: 'Completed',
        completedSteps: ['Understanding', 'KnowledgeRetrieval', 'Investigation', 'Decision', 'RiskCheck', 'HumanApproval', 'Communication'],
        isProcessing: false,
        lastUpdated: new Date()
      },
      understandingResult: {
        intent: 'Payment Deducted / Order Cancelled Inconsistency - Refund Request',
        urgency: 'High',
        sentiment: 'Negative',
        extractedEntities: {
          orderId: 'ORD-9821',
          paymentId: 'TXN-4921',
          amount: 129.99,
          issueType: 'Payment Captured on Cancelled Order'
        },
        suggestedCategory: 'Cancellation & Refund',
        confidence: 0.98,
        executedAt: new Date()
      },
      ragResult: {
        retrievedDocuments: [{
          title: 'Payment Failure & Auto-Refund SOP',
          policyCode: 'POL-101',
          category: 'Billing & Payments',
          relevantExcerpt: 'Section 3.1: When payment deduction is verified on Payment Gateway but Order is CANCELLED in OMS, issue 100% full refund.',
          relevanceScore: 96.4
        }],
        appliedPolicy: 'Payment Failure & Auto-Refund SOP',
        policyReference: 'POL-101',
        executedAt: new Date()
      },
      investigationResult: {
        toolCalls: [
          { toolName: 'Order Lookup', endpoint: '/api/tools/orders/ORD-9821', status: 'SUCCESS', data: { orderId: 'ORD-9821', status: 'Cancelled', totalAmount: 129.99 } },
          { toolName: 'Payment Lookup', endpoint: '/api/tools/payments/TXN-4921', status: 'SUCCESS', data: { paymentId: 'TXN-4921', status: 'SUCCESS', amount: 129.99 } },
          { toolName: 'Customer CRM Lookup', endpoint: '/api/tools/customers/sarah.jenkins@example.com', status: 'SUCCESS', data: { customerId: 'CUST-104', tier: 'Gold', riskScore: 8 } }
        ],
        orderVerified: true,
        paymentVerified: true,
        orderStatus: 'Cancelled',
        paymentStatus: 'SUCCESS',
        evidenceSummary: 'OMS confirms order ORD-9821 was cancelled. Payment Gateway confirms $129.99 was successfully charged on TXN-4921. Discrepancy confirmed.',
        discrepancyFound: true,
        executedAt: new Date()
      },
      decisionResult: {
        decision: 'Full Refund Approved',
        recommendation: 'Execute automated refund of $129.99 to customer original payment method.',
        evidencePoints: [
          'Order ORD-9821 marked Cancelled in OMS.',
          'Payment Gateway confirmed capture of $129.99 on TXN-4921.',
          'SOP POL-101 Section 3.1 mandates 100% refund on cancelled orders.'
        ],
        policyComplianceStatement: 'Fully compliant with POL-101 Section 3.1 ($129.99 < $150.00 auto limit).',
        confidence: 0.99,
        reasoningSummary: 'Verified tool ledger matches SOP criteria. Discrepancy verified without hallucination.',
        executedAt: new Date()
      },
      riskCheckResult: {
        riskLevel: 'Low',
        riskScore: 8,
        riskFactors: ['Amount ($129.99) within safe autonomous limit ($150.00)', 'Customer risk score 8 (Low Risk)'],
        requiresApproval: false,
        autoExecutable: true,
        executedAt: new Date()
      },
      actionResult: {
        actionType: 'PROCESS_AUTO_REFUND',
        actionStatus: 'EXECUTED',
        actionSummary: 'Autonomous remedy executed: Dispatched refund of $129.99 to Stripe PG for TXN-4921. Ref: REFUND-AUTO-84210.',
        isMockAction: true,
        mockTransactionRef: 'REFUND-AUTO-84210',
        executedAt: new Date()
      },
      communicationResult: {
        recipientEmail: 'sarah.jenkins@example.com',
        subject: 'Update regarding your Order #ORD-9821 Inquiry',
        body: 'Dear Sarah Jenkins,\n\nThank you for reaching out to us. We have investigated the issue regarding your order #ORD-9821.\n\nWe confirmed that your card was billed while the order was cancelled by our system. We have issued a full refund of $129.99 back to your original payment method.\n\nRefund Reference: REFUND-AUTO-84210\nEstimated Settlement: 3 to 5 business days depending on your bank.\n\nWe sincerely apologize for any inconvenience caused.\n\nWarm regards,\nOpsMind AI Operations Support Team',
        tone: 'Empathetic & Professional',
        isSimulatedSent: true,
        verifiedFactsUsed: [
          'Order status verified: Cancelled',
          'Payment status confirmed: $129.99 charged',
          'Refund issued: $129.99'
        ],
        policyCitations: ['POL-101 Section 3.1: Payment Failure SOP'],
        generatedAt: new Date()
      },
      metrics: {
        totalDurationMs: 1120,
        estimatedCostUSD: 0.0035,
        groundednessScore: 98.5,
        accuracyScore: 99.0
      },
      createdBy: adminUser._id
    });

    // Communication entry for demo case
    await Communication.create({
      caseId: demoCase._id,
      caseNumber: demoCase.caseNumber,
      channel: 'EMAIL',
      recipient: { name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com' },
      subject: 'Update regarding your Order #ORD-9821 Inquiry',
      body: demoCase.communicationResult.body,
      status: 'SIMULATED_SENT',
      verifiedFacts: demoCase.communicationResult.verifiedFactsUsed,
      policyCitations: demoCase.communicationResult.policyCitations,
      sentAt: new Date()
    });

    // Seed Audit Log for Demo Case
    await AuditLog.create([
      {
        caseId: demoCase._id,
        caseNumber: demoCase.caseNumber,
        eventType: 'CASE_CREATED',
        agentName: 'Case Intake',
        actor: { name: 'Sarah Jenkins', role: 'Customer' },
        actionDescription: 'Case CASE-1001 created with title: "Payment was deducted but my order was cancelled."'
      },
      {
        caseId: demoCase._id,
        caseNumber: demoCase.caseNumber,
        eventType: 'UNDERSTANDING_COMPLETED',
        agentName: 'Understanding Agent',
        actionDescription: 'Extracted intent: "Payment Deducted / Order Cancelled Inconsistency - Refund Request" with urgency High',
        details: demoCase.understandingResult
      },
      {
        caseId: demoCase._id,
        caseNumber: demoCase.caseNumber,
        eventType: 'RAG_RETRIEVED',
        agentName: 'RAG Knowledge Agent',
        actionDescription: 'Grounding against Payment Failure & Auto-Refund SOP (POL-101)',
        details: demoCase.ragResult
      },
      {
        caseId: demoCase._id,
        caseNumber: demoCase.caseNumber,
        eventType: 'INVESTIGATION_COMPLETED',
        agentName: 'Investigation Agent',
        actionDescription: 'Queried OMS and PG. Discrepancy Found: true',
        details: demoCase.investigationResult
      },
      {
        caseId: demoCase._id,
        caseNumber: demoCase.caseNumber,
        eventType: 'DECISION_CREATED',
        agentName: 'Decision Agent',
        actionDescription: 'Decision: Full Refund Approved',
        details: demoCase.decisionResult
      },
      {
        caseId: demoCase._id,
        caseNumber: demoCase.caseNumber,
        eventType: 'RISK_CHECK_COMPLETED',
        agentName: 'Risk Check Agent',
        actionDescription: 'Risk evaluated as Low. Approval Required: false',
        details: demoCase.riskCheckResult
      },
      {
        caseId: demoCase._id,
        caseNumber: demoCase.caseNumber,
        eventType: 'ACTION_EXECUTED',
        agentName: 'Action Agent',
        actionDescription: demoCase.actionResult.actionSummary,
        details: demoCase.actionResult
      },
      {
        caseId: demoCase._id,
        caseNumber: demoCase.caseNumber,
        eventType: 'COMMUNICATION_GENERATED',
        agentName: 'Communication Agent',
        actionDescription: 'Customer draft prepared for sarah.jenkins@example.com',
        details: demoCase.communicationResult
      }
    ]);

    // Additional synthetic high risk case for Human Approval queue
    const highRiskCase = await Case.create({
      caseNumber: 'CASE-1002',
      title: 'Order Cancelled after $310.00 Charge on 4K Gaming Monitor',
      description: 'Customer charged $310.00 for 4K Gaming Monitor (Order #ORD-3310, Payment Ref: TXN-9910). Order was cancelled due to stock depletion.',
      customer: {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        customerId: 'CUST-305'
      },
      category: 'Billing & Payments',
      priority: 'Critical',
      status: 'Awaiting Approval',
      orderId: 'ORD-3310',
      paymentId: 'TXN-9910',
      workflowState: {
        currentStep: 'HumanApproval',
        completedSteps: ['Understanding', 'KnowledgeRetrieval', 'Investigation', 'Decision', 'RiskCheck', 'HumanApproval'],
        isProcessing: false,
        lastUpdated: new Date()
      },
      decisionResult: {
        decision: 'Full Refund of $310.00 (Pending Authorization)',
        recommendation: 'Issue $310.00 full refund for cancelled order ORD-3310.',
        evidencePoints: ['Payment TXN-9910 confirmed $310.00 captured', 'Order ORD-3310 cancelled in OMS'],
        policyComplianceStatement: 'Applies POL-101 Section 3.2: Amounts > $150.00 require manager approval.',
        confidence: 0.98,
        reasoningSummary: 'Payment was captured but order was cancelled due to warehouse stockout. Amount exceeds $150.00 auto limit.'
      },
      riskCheckResult: {
        riskLevel: 'High',
        riskScore: 75,
        riskFactors: ['Transaction amount ($310.00) exceeds autonomous threshold ($150.00)', 'High-value consumer electronics item'],
        requiresApproval: true,
        autoExecutable: false
      },
      createdBy: adminUser._id
    });

    const pendingApproval = await Approval.create({
      caseId: highRiskCase._id,
      caseNumber: highRiskCase.caseNumber,
      caseTitle: highRiskCase.title,
      customer: highRiskCase.customer,
      proposedAction: 'Issue Full Refund of $310.00 to Amex ****1002 for Cancelled Order ORD-3310',
      riskLevel: 'High',
      riskReason: 'Disbursement amount ($310.00) exceeds autonomous threshold ($150.00)',
      confidenceScore: 0.98,
      evidenceSummary: 'OMS reports ORD-3310 Cancelled. Payment Gateway reports TXN-9910 ($310.00) Settled.',
      policyReference: 'POL-101 Section 3.2',
      status: 'PENDING'
    });

    highRiskCase.approvalInfo = {
      approvalId: pendingApproval._id,
      status: 'PENDING',
      requestedAt: new Date()
    };
    await highRiskCase.save();

    console.log('Database seeded successfully with all demo artifacts!');
    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Database seeding failed:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
    throw error;
  }
}

if (require.main === module) {
  seedDatabase(true);
}

module.exports = seedDatabase;
