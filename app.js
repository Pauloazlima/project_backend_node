const express = require('express');
const app = express();

PORT = 8080

const productsRouter = require('./src/routes/products.routes')

app.use(express.json());

app.use('/products', productsRouter)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});