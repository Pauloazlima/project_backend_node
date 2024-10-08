const fs = require('fs');

const ProductManager = require('../modules/ProductManager')

const productManager = new ProductManager('src/files/products.json');

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveCarts(carts) {
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.getCarts();
    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

    const newCart = {
      id: newId,
      products: []
    };
    carts.push(newCart);
    await this.saveCarts(carts);

    return newCart;
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === cartId);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(cart => cart.id === cartId);

    if (!cart) {
        throw new Error('Carrinho não encontrado');
    }

    const productIndex = cart.products.findIndex(item => item.product === productId);

    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        const product = await productManager.getProductById(productId);
        cart.products.push({ product: productId, quantity: 1 });
    }

    await this.saveCarts(carts);
    return cart;
}
}

module.exports = CartManager;
