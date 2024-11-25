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

router.get('/paginate', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    
    const filter = query
      ? { $or: [{ category: query }, { stock: { $gt: 0 } }] }
      : {};

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
    };

    const products = await productsModel.paginate(filter, options);

    const prevLink = products.hasPrevPage
      ? `/paginate?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
      : null;
    const nextLink = products.hasNextPage
      ? `/paginate?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
      : null;

    res.status(200).json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Erro ao buscar produtos' });
  }
});

router.get('/products/paginate', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query
      ? { $or: [{ category: query }, { stock: { $gt: 0 } }] }
      : {};


    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
      lean: true 
    };

    const products = await productsModel.paginate(filter, options);

    const prevLink = products.hasPrevPage
      ? `/products/mongo/products/paginate?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
      : null;
    const nextLink = products.hasNextPage
      ? `/products/mongo/products/paginate?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
      : null;

    res.render('productsPagination', { 
      products: {
        docs: products.docs,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink,
        nextLink
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao renderizar produtos' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsModel.findById(id).lean(); 

    if (!product) {
      return res.status(404).render('error', { message: 'Produto não encontrado' });
    }

    res.render('productDetails', { product });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).render('error', { message: 'Erro ao buscar produto' });
  }
});



module.exports = router