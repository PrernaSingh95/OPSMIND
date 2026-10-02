const MockOrder = require('../models/MockOrder');
const MockPayment = require('../models/MockPayment');
const MockCustomer = require('../models/MockCustomer');
const ToolResult = require('../models/ToolResult');

/**
 * Mock Order Lookup Tool
 */
const lookupOrder = async (orderId, caseId = null) => {
  const startTime = Date.now();
  let result = null;
  let status = 'SUCCESS';

  if (!orderId) {
    status = 'NOT_FOUND';
    result = { found: false, message: 'No Order ID provided in case context' };
  } else {
    const order = await MockOrder.findOne({ orderId: orderId.trim().toUpperCase() });
    if (order) {
      result = {
        found: true,
        orderId: order.orderId,
        customerId: order.customerId,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency,
        items: order.items,
        paymentId: order.paymentId,
        cancelReason: order.cancelReason,
        orderDate: order.orderDate
      };
    } else {
      status = 'NOT_FOUND';
      result = {
        found: false,
        orderId,
        message: `Order ID ${orderId} was not found in Mock OMS Database.`
      };
    }
  }

  const executionTimeMs = Date.now() - startTime + Math.floor(Math.random() * 40 + 30);

  if (caseId) {
    await ToolResult.create({
      caseId,
      toolName: 'Order Management System (OMS) Lookup',
      inputParams: { orderId },
      outputData: result,
      status,
      executionTimeMs
    });
  }

  return {
    toolName: 'Order Lookup',
    endpoint: `/api/tools/orders/${orderId || 'N/A'}`,
    status,
    executionTimeMs,
    data: result
  };
};

/**
 * Mock Payment Gateway Lookup Tool
 */
const lookupPayment = async (paymentId, caseId = null) => {
  const startTime = Date.now();
  let result = null;
  let status = 'SUCCESS';

  if (!paymentId) {
    status = 'NOT_FOUND';
    result = { found: false, message: 'No Payment ID provided in case context' };
  } else {
    const payment = await MockPayment.findOne({ paymentId: paymentId.trim().toUpperCase() });
    if (payment) {
      result = {
        found: true,
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        customerId: payment.customerId,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        status: payment.status,
        gatewayTransactionRef: payment.gatewayTransactionRef,
        refundStatus: payment.refundStatus,
        refundAmount: payment.refundAmount,
        paymentDate: payment.paymentDate
      };
    } else {
      status = 'NOT_FOUND';
      result = {
        found: false,
        paymentId,
        message: `Payment ID ${paymentId} was not found in Mock Payment Gateway Database.`
      };
    }
  }

  const executionTimeMs = Date.now() - startTime + Math.floor(Math.random() * 30 + 25);

  if (caseId) {
    await ToolResult.create({
      caseId,
      toolName: 'Payment Gateway (PG) Lookup',
      inputParams: { paymentId },
      outputData: result,
      status,
      executionTimeMs
    });
  }

  return {
    toolName: 'Payment Lookup',
    endpoint: `/api/tools/payments/${paymentId || 'N/A'}`,
    status,
    executionTimeMs,
    data: result
  };
};

/**
 * Mock Customer CRM Lookup Tool
 */
const lookupCustomer = async (customerIdOrEmail, caseId = null) => {
  const startTime = Date.now();
  let result = null;
  let status = 'SUCCESS';

  if (!customerIdOrEmail) {
    status = 'NOT_FOUND';
    result = { found: false, message: 'No customer identifier provided' };
  } else {
    const customer = await MockCustomer.findOne({
      $or: [
        { customerId: customerIdOrEmail.trim().toUpperCase() },
        { email: customerIdOrEmail.trim().toLowerCase() }
      ]
    });

    if (customer) {
      result = {
        found: true,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        tier: customer.tier,
        lifetimeSpend: customer.lifetimeSpend,
        riskScore: customer.riskScore,
        totalCases: customer.totalCases
      };
    } else {
      // Return safe defaults for demo user
      result = {
        found: true,
        customerId: 'CUST-DEMO',
        name: customerIdOrEmail,
        email: customerIdOrEmail.includes('@') ? customerIdOrEmail : 'customer@example.com',
        tier: 'GOLD',
        lifetimeSpend: 1450.0,
        riskScore: 8,
        totalCases: 2
      };
    }
  }

  const executionTimeMs = Date.now() - startTime + Math.floor(Math.random() * 25 + 20);

  if (caseId) {
    await ToolResult.create({
      caseId,
      toolName: 'Customer 360 CRM Lookup',
      inputParams: { customerIdOrEmail },
      outputData: result,
      status,
      executionTimeMs
    });
  }

  return {
    toolName: 'Customer CRM Lookup',
    endpoint: `/api/tools/customers/${customerIdOrEmail || 'N/A'}`,
    status,
    executionTimeMs,
    data: result
  };
};

module.exports = {
  lookupOrder,
  lookupPayment,
  lookupCustomer,
  getOrderDetails: lookupOrder,
  getPaymentStatus: lookupPayment,
  getCustomerProfile: lookupCustomer
};

