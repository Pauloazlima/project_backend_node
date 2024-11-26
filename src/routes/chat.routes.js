const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('chat'); // Caminho relativo à pasta de views configurada
});

module.exports = router;