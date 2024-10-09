const express = require('express');
const router = express.Router();

const ProductManager = require('../modules/ProductManager');
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

router.post('/', async(req, res) => {
  try{
    const prod = req.body
    const addedProduct = await productManager.addProduct(prod);
    console.log(addedProduct);
    
    return res.json({addedProduct})
  }
  catch(error){
    console.log(error);    
    return res.status(404).json({error: 'não realizado'})
  }
})

router.put('/:pid', async (req, res) => {
  try{
    const pid = parseInt(req.params.pid);
    const updatedFields = req.body;

    if ('id' in updatedFields){
      delete updatedFields.id
    }
    const updatedProduct = await productManager.updateProduct(pid, updatedFields)
    return res.json({updatedProduct})
  }
  catch(error){
    return res.status(500).json({"error": 'Não realizado'})
  }
}
)

router.delete('/:pid', async (req, res) => {
  try{
    const pid = parseInt(req.params.pid);
    await productManager.deleteProduct(pid);
    return res.json({message: 'Produto deletado com sucesso'})
  } catch (error){
  return res.status(404).json({error: 'Produto não encontrado'})
}}
)

module.exports = router;



