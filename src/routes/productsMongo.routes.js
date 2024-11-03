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


module.exports = router