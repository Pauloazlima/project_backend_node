const express = require('express');
const router = express.Router();
const CartManager = require('../modules/CartManager');

const cartManager = new CartManager('src/files/carts.json');

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    return res.status(201).json({ cart: newCart });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar o carrinho' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    return res.json({ products: cart.products });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar o carrinho' });
  }
});

// Rota para adicionar um produto ao carrinho com quantidade
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const updatedCart = await cartManager.addProductToCart(cartId, productId);

    return res.json({ cart: updatedCart });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao adicionar o produto ao carrinho' });
  }
});

module.exports = router;

