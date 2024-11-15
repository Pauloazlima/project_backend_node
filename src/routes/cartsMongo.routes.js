const express = require('express');

const cartsModel = require('../models/carts.model')

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const inputInfo = await cartsModel.create(req.body);
    const populatedCart = await inputInfo.populate('products.productId'); // Popula os detalhes dos produtos
    res.status(201).json({ result: 'success', payload: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ result: 'erro', error: 'Erro ao adicionar o carrinho' });
  }
});


router.get('/', async (req, res) => {
  try {
    const carts = await cartsModel.find().populate('products.productId');

    res.status(200).json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar os carrinhos' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartsModel.findById(cid).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o carrinho' });
  }
});



router.put('/:cid', async (req, res) => {
	try{
		const { cid } = req.params;

		let getCartInfo = await cartsModel.findByIdAndUpdate(cid, req.body)

		res.status(201).json({result: 'success', payload: getCartInfo})
		
	} catch(error){
		res.status(500).send({result: 'erro', error: 'Cart não localizado'})
	}
})
router.post('/add/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const updatedCart = await cartsModel.findByIdAndUpdate(
      cid,
      { $addToSet: { products: { $each: products } } },
      { new: true }
    ).populate('products.productId'); // Popula os detalhes dos produtos

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o carrinho' });
  }
});


router.delete('/delete/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const deletedCart = await cartsModel.findByIdAndDelete(cid);

    if (!deletedCart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    res.status(200).json({ message: 'Carrinho excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir o carrinho' });
  }
});


router.put('/:cid/products', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Envie um array de IDs de produtos para remoção' });
    }

    const updatedCart = await cartsModel.updateOne(
      { _id: cid },
      { $pull: { products: { $in: products } } }
    );

    if (updatedCart.modifiedCount === 0) {
      return res.status(404).json({ message: 'Carrinho não encontrado ou produtos inexistentes no carrinho' });
    }

    res.status(200).json({ message: 'Produtos removidos do carrinho com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover produtos do carrinho' });
  }
});






module.exports = router