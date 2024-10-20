const express = require('express');
const router = express.Router();
const ProductManager = require('../modules/ProductManager');
const productManager = new ProductManager('src/files/products.json');


router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('index', { title: 'Página Inicial', products });
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    res.status(500).send('Erro ao carregar produtos');
  }
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  productsCurated = JSON.stringify(products)
  console.log(productsCurated);
  
  res.render('layouts/realTimeProducts', { productsCurated });
})

module.exports = router;
