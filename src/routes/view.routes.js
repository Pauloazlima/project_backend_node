const express = require('express');
const router = express.Router();
const ProductManager = require('../modules/ProductManager');
const productManager = new ProductManager('src/files/products.json');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();  
  res.json(products);
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
})

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));


router.get('/products', requireAuth, async (req, res) => {
  const products = await productManager.getProducts();
  res.render('products', { user: req.session.user, products });
});


module.exports = router;
