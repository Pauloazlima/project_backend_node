const express = require('express');
const ProductManager = require('./modules/ProductManager');

const productManager = new ProductManager('./products.json');
const app = express();
const PORT = 8080;

app.get('/products', async (req, res) => {
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
});

app.get('/products/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);
    return res.json({ product });
  } catch (error) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


