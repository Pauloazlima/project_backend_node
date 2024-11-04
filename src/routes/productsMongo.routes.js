const express = require('express');

const productsModel = require('../models/products.model')

const router = express.Router();

router.get('/mongo', async (req,res) => {
  try {
    let getProducts = await productsModel.find();
    res.json({result: 'sucesso', payload: getProducts})
  } catch (error){
    console.log('products notFound', error);
    res.status(500).send({result: error})
}
})

router.post('/add', async (req,res) => {
  try {
      let  {title, description, price, thumbnail, code, stock, category} = req.body;
      if (!title, !description, !price, !thumbnail, !code, !stock, !category){
        return res.status(500).send({result: 'Todos os campos são obrigatórios'})
      }
      let inputInfo = await productsModel.create(body)
      res.status(201).json({result: 'success', payload: inputInfo})
  } catch (error){
    console.log('não foi possivel adicionar as informacoes do produto');
    res.status(500).send({result: 'erro', error: 'Erro ao adicionar'})
    

  }
})


module.exports = router