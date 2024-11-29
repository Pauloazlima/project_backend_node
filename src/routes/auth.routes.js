const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const passport = require('passport');
const router = express.Router();


// router.post('/register', async (req, res) => {
//     console.log('Body recebido:', req.body);
//     const { name, email, password } = req.body;
  
//     if (!name || !email || !password) {
//       return res.status(400).send('Todos os campos são obrigatórios.');
//     }
  
//     try {
//       const newUser = new User({ name, email, password });
//       await newUser.save();
//       res.redirect('/login');
//     } catch (error) {
//       console.error('Erro ao registrar usuário:', error);
//       res.status(500).send('Erro no servidor');
//     }
//   })


// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ message: 'Credenciais inválidas' });
//         }

        
//         if (user.password !== password) {
//             return res.status(401).json({ message: 'Credenciais inválidas' });
//         }

//         return res.redirect('/products/mongo/products/paginate');
//     } catch (error) {
//         console.error('Erro durante o login:', error);
//         return res.status(500).json({ message: 'Erro interno do servidor' });
//     }
// });

// router.post('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Erro ao fazer logout' });
//     }
//     res.status(200).json({ message: 'Logout bem-sucedido' });
//   });
// });

// Registro
router.post(
  '/register',
  passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/register',
    failureFlash: true,
  })
);

// Login
router.post(
  '/login',
  passport.authenticate('login', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Erro ao fazer logout' });
    res.redirect('/login');
  });
});

// GitHub Login
router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: '/products',
    failureRedirect: '/login',
  })
);



module.exports = router;
