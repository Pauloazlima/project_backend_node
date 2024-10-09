const express = require('express');
const app = express();

PORT = 8080

const productsRouter = require('./src/routes/products.routes')
const cartsRouter = require('./src/routes/carts.routes')

app.use(express.json());

app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});