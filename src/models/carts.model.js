const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    subtotal: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Função para calcular o total e totalItemPrice
cartsSchema.methods.calculateTotalPrice = async function () {
  let subtotal = 0;

  // Percorre os produtos do carrinho e atualiza os preços
  for (const product of this.products) {
    const dbProduct = await Product.findById(product.productId);
    if (dbProduct) {
      product.priceAtPurchase = dbProduct.price; // Atualiza o preço
      product.totalItemPrice = product.quantity * product.priceAtPurchase; // Recalcula o total do item
      subtotal += product.totalItemPrice;
    } else {
      throw new Error(`Produto com ID ${product.productId} não encontrado.`);
    }
  }

  // Atualiza o total do carrinho
  this.priceSummary.subtotal = subtotal;
  this.priceSummary.total = subtotal - this.discounts.discountValue;
};

// Hook para quando o carrinho for atualizado
cartsSchema.pre('findOneAndUpdate', async function (next) {
  // Aqui, forçamos a busca do documento antes de atualizá-lo
  const updatedDoc = await this.model.findOne(this.getQuery());

  if (updatedDoc) {
    // Chama a função para recalcular os preços ao atualizar o carrinho
    await updatedDoc.calculateTotalPrice();
  }

  next();
});

// Hook para quando o carrinho for salvo (inclusão de novo carrinho)
cartsSchema.pre('save', async function (next) {
  if (this.isModified('products')) {
    await this.calculateTotalPrice();
  }
  next();
});

// Método para atualizar o carrinho (via PUT)
cartsSchema.methods.updateCart = async function (updates) {
  // Atualizando o carrinho com a nova quantidade e recalculando os preços
  const updatedCart = Object.assign(this, updates);
  await this.calculateTotalPrice();
  await this.save(); // Salva o carrinho atualizado
  return updatedCart;
};

cartsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model(cartsCollection, cartsSchema);
