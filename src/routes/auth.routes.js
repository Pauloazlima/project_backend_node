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
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      role: user.role,
    };

    res.status(200).json({ message: 'Login bem-sucedido', user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
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
