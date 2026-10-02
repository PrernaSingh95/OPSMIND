const express = require('express');
const router = express.Router();
const {
  getOrder,
  getPayment,
  getCustomer,
  getSandboxStatus
} = require('../controllers/toolController');
const { protect } = require('../middleware/auth');

router.get('/orders/:orderId', protect, getOrder);
router.get('/payments/:paymentId', protect, getPayment);
router.get('/customers/:customerId', protect, getCustomer);
router.get('/sandbox-status', protect, getSandboxStatus);

module.exports = router;
