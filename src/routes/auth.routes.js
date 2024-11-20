const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
    console.log('Body recebido:', req.body); // Log para debug
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }
  
    try {
      // Criação do usuário (substitua pela lógica real)
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.redirect('/login');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).send('Erro no servidor');
    }
  })

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }); // Verifica se o usuário existe
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Comparação direta ou com bcrypt (se aplicável)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Se login for bem-sucedido, redireciona para a rota de produtos
        return res.redirect('/products/mongo/products/paginate');
    } catch (error) {
        console.error('Erro durante o login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.status(200).json({ message: 'Logout bem-sucedido' });
  });
});

module.exports = router;
