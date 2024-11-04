const express = require('express');

const productsModel = require('../models/products.model')

const router = express.Router();

router.get('/', async (req,res) => {
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
      let inputInfo = await productsModel.create(req.body)
      res.status(201).json({result: 'success', payload: inputInfo})
  } catch (error){
    console.log('não foi possivel adicionar as informacoes do produto');
    res.status(500).send({result: 'erro', error: 'Erro ao adicionar'})
  }
})

router.put('/:id', async(req,res) => {
  try{
    let {id} = req.params
    let {title, description, price, thumbnail, code, stock, category} = req.body;
    let getProduct = await productsModel.findById(id)

    if (!getProduct){
      return res.status(404).send({result: 'erro', error: 'product not found'})
    }
    
    getProduct.title = title || getProduct.title 
    getProduct.description = description || getProduct.description 
    getProduct.price = price || getProduct.price 
    getProduct.thumbnail = thumbnail || getProduct.thumbnail 
    getProduct.code = code || getProduct.code 
    getProduct.stock = stock || getProduct.stock 
    getProduct.category = category || getProduct.category 

    let updateProduct = await getProduct.save()

    console.log(updateProduct);

    res.status(200).json({result: 'success', payload: updateProduct})
  } catch{
    console.log('Nao foi possivel atualizar');
    res.status(500).send({result: 'erro', error: 'Erro ao atualizar'})
  }
});

router.get('/:id', async(req,res) => {
  try{
    const {id} = req.params;

    const getInfo = await productsModel.findById(id)
    
    res.status(201).send({result: 'success', payload: getInfo})
    } catch (error) {
    console.log('Product not found');
    res.status(500).send({result: 'erro', error: 'Erro ao atualizar'})
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteInfo = await productsModel.findByIdAndDelete(id);

    if (!deleteInfo) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.status(200).send('Usuário deletado');
  } catch (error) {
    res.status(500).send(error);
  }
});



module.exports = router