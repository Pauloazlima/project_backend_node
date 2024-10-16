const express = require('express');
const router = express.Router();
const ProductManager = require('../modules/ProductManager');
const productManager = new ProductManager('src/files/products.json');

// Rota para a página inicial que renderiza a lista de produtos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('index', { title: 'Página Inicial', products });
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    res.status(500).send('Erro ao carregar produtos');
  }
});

module.exports = router;
