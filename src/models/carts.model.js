const mongoose = require('mongoose');

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, required: true, default: 1 },
        priceAtPurchase: { type: Number, required: true },
        totalItemPrice: { type: Number, required: true }
      }
    ],
    discounts: {
      couponCode: { type: String },
      discountValue: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    },
    priceSummary: {
      subtotal: { type: Number, required: true },
      discountTotal: { type: Number, default: 0 },
      total: { type: Number, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  // Middleware para atualizar o campo `updatedAt` automaticamente antes de salvar
  cartsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });

module.exports = mongoose.model(cartsCollection, cartsSchema);