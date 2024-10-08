const express = require('express');
const router = express.Router();

const ProductManager = require('../modules/aula04_NewProductManager');
const productManager = new ProductManager('src/files/products.json');

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();

    const limit = req.query.limit;

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      return res.json({ products: limitedProducts });
    }

    return res.json({ products });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter os produtos' });
  }
}
);

router.get('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);
    return res.json({ product });
  } catch (error) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
});

module.exports = router;



