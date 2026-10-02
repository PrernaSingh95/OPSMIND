const mongoose = require('mongoose');

const mockPaymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: String,
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  method: {
    type: String,
    enum: ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'UPI'],
    default: 'CREDIT_CARD'
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
    required: true
  },
  gatewayTransactionRef: String,
  refundStatus: {
    type: String,
    enum: ['NONE', 'REQUESTED', 'PROCESSED', 'REJECTED'],
    default: 'NONE'
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MockPayment', mockPaymentSchema);
