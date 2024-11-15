const mongoose = require('mongoose');

const cartsCollection = 'carts';
const Product = require('./products.model');

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
     // Importa o modelo de produtos

cartsSchema.pre('save', async function (next) {
  let subtotal = 0;

  for (const product of this.products) {
    const dbProduct = await Product.findById(product.productId);
    if (dbProduct) {
      product.priceAtPurchase = dbProduct.price; // Usa o preço do banco
      product.totalItemPrice = product.quantity * product.priceAtPurchase;
      subtotal += product.totalItemPrice;
    } else {
      throw new Error(`Produto com ID ${product.productId} não encontrado.`);
    }
  }

  this.priceSummary.subtotal = subtotal;
  this.priceSummary.total = subtotal - this.discounts.discountValue;

  next();
});


module.exports = mongoose.model(cartsCollection, cartsSchema);