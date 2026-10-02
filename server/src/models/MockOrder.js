const mongoose = require('mongoose');

const mockOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: true
  },
  items: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'],
    required: true
  },
  paymentId: String,
  cancelReason: String,
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MockOrder', mockOrderSchema);
