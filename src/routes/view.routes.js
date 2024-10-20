const express = require('express');
const router = express.Router();
const ProductManager = require('../modules/ProductManager');
const productManager = new ProductManager('src/files/products.json');


router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  productsCurated = JSON.stringify(products)  
  res.render('layouts/main', { productsCurated });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  productsCurated = JSON.stringify(products)  
  res.render('layouts/realTimeProducts', { productsCurated });
})

module.exports = router;
