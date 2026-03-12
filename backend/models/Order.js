const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  store_id: { type: String },
  items: [orderItemSchema],
  type: { type: String, enum: ['pickup', 'delivery'], required: true },
  address: { type: String },
  status: { type: String, default: 'pending' },
  pickupToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  total: { type: Number, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
