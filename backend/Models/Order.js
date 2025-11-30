const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  cantidad: { type: Number, required: true, default: 1 },
  precio: { type: Number, required: true, default: 0 }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], default: [] },
  total: { type: Number, required: true, default: 0 },
  direccion: { type: String },
  estado: { type: String, enum: ['pendiente','procesando','enviado','cancelado'], default: 'pendiente' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
