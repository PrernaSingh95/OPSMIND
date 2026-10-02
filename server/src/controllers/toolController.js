const MockOrder = require('../models/MockOrder');
const MockPayment = require('../models/MockPayment');
const MockCustomer = require('../models/MockCustomer');
const { getOrderDetails, getPaymentStatus, getCustomerProfile } = require('../services/toolService');

exports.getOrder = async (req, res) => {
  try {
    const data = await getOrderDetails(req.params.orderId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const data = await getPaymentStatus(req.params.paymentId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const data = await getCustomerProfile(req.params.customerId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSandboxStatus = async (req, res) => {
  try {
    const [ordersCount, paymentsCount, customersCount] = await Promise.all([
      MockOrder.countDocuments(),
      MockPayment.countDocuments(),
      MockCustomer.countDocuments()
    ]);
    res.json({
      success: true,
      data: {
        ordersCount,
        paymentsCount,
        customersCount,
        sandboxHealthy: true
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
