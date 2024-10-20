const express = require('express');
const router = express.Router();
const ProductManager = require('../modules/ProductManager');
const productManager = new ProductManager('src/files/products.json');


router.get('/', async (req, res) => {
  const products = await productManager.getProducts();  
  res.json(products);
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('layouts/realTimeProducts', { products });
})

module.exports = router;
