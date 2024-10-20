const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const ProductManager = require('./modules/ProductManager');
const productManager = new ProductManager('src/files/products.json');
const httpServer = createServer(app);
const io = new Server(httpServer);

PORT = 8080

const productsRouter = require('./routes/products.routes')
const cartsRouter = require('./routes/carts.routes')
const viewRouter = require('./routes/view.routes');

app.use(express.json());

app.engine('handlebars', handlebars.engine({ defaultLayout: 'realTimeProducts' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewRouter);

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  const updateProductList = async () => {
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
  };

  socket.on('addProduct', async (productData) => {
    await productManager.addProduct(productData);
    updateProductList();
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});