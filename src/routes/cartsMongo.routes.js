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


module.exports = router