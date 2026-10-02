const mongoose = require('mongoose');

const mockCustomerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  tier: {
    type: String,
    enum: ['STANDARD', 'SILVER', 'GOLD', 'PLATINUM'],
    default: 'STANDARD'
  },
  lifetimeSpend: {
    type: Number,
    default: 0
  },
  riskScore: {
    type: Number,
    default: 10 // 0-100 (lower is safer)
  },
  totalCases: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MockCustomer', mockCustomerSchema);
