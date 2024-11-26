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
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');

PORT = 8080

const productsRouter = require('./routes/products.routes')
const cartsRouter = require('./routes/carts.routes')
const viewRouter = require('./routes/view.routes');
const productsMongoRouter = require('./routes/productsMongo.routes')
const cartsMongoRouter = require('./routes/cartsMongo.routes')

const Message = require('./models/messages.model');

const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);


mongoose.connect('mongodb+srv://pauloazlima3008:coderback@coderback.kbql2.mongodb.net/', {
  dbName: 'test',
})
.then(() => {
  console.log('Conectado ao MongoDB com sucesso');
})
.catch((error) => {
  console.log('Erro ao conectar ao MongoDB: ', error);
});


app.get('/chat', (req, res) => {
  res.render('chat')
})

app.engine('handlebars', handlebars.engine(/*{ defaultLayout: 'realTimeProducts' }*/));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewRouter);
app.use('/products/mongo', productsMongoRouter)
app.use('/carts/mongo', cartsMongoRouter)

const chatRouter = require('./routes/chat.routes');
app.use('/chat', chatRouter);

app.set('views', path.join(__dirname, 'views'));

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  Message.find().then((messages) => {
    messages.forEach((msg) => {
      socket.emit('message', msg);
    });
  });

  socket.on('newMessage', async (data) => {
    try {
      const newMessage = new Message(data);
      await newMessage.save();
      io.emit('message', data);
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

app.use(
  session({
    secret: 'seuSegredoSuperSecreto',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://pauloazlima3008:coderback@coderback.kbql2.mongodb.net/',
      ttl: 60 * 60, 
    }),
  })
);

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});