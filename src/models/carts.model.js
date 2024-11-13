const mongoose = require('mongoose');

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
          quantity: { type: Number, required: true, default: 1 },
          priceAtPurchase: { type: Number, required: true },
          totalItemPrice: { type: Number, required: true, default: 0 }
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
      }
    }, {
      timestamps: true
    });
    
    // Pre-save hook para calcular o `totalItemPrice` para cada produto no carrinho
    cartsSchema.pre('save', function(next) {
      let subtotal = 0;
    
      // Iterar sobre os produtos para calcular `totalItemPrice` e o `subtotal`
      this.products.forEach(product => {
        product.totalItemPrice = product.quantity * product.priceAtPurchase;
        subtotal += product.totalItemPrice;
      });
    
      // Calcular o total final do carrinho
      this.priceSummary.subtotal = subtotal;
      this.priceSummary.total = subtotal - this.discounts.discountValue;
    
      next();
    });

module.exports = mongoose.model(cartsCollection, cartsSchema);