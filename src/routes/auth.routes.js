const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const router = express.Router();

router.post('/register', async (req, res) => {
    console.log('Body recebido:', req.body);
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }
  
    try {
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.redirect('/login');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).send('Erro no servidor');
    }
  })


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        
        if (user.password !== password) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        return res.redirect('/products/mongo/products/paginate');
    } catch (error) {
        console.error('Erro durante o login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.status(200).json({ message: 'Logout bem-sucedido' });
  });
});

module.exports = router;
