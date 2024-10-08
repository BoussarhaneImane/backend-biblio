const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
