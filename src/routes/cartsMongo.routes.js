const express = require('express');

const cartsModel = require('../models/carts.model')

const router = express.Router();

router.post('/create', async (req,res) => {
  try {
		console.log(req.body);
		
      let inputInfo = await cartsModel.create(req.body)
      res.status(201).json({result: 'success', payload: inputInfo})
  } catch (error){
    console.log('não foi possivel adicionar as informacoes do produto');
    res.status(500).send({result: 'erro', error: 'Erro ao adicionar'})
  }
})

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
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o carrinho' });
  }
});


router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Tenta encontrar e deletar o carrinho pelo ID
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



module.exports = router