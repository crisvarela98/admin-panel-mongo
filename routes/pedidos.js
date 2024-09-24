const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedido');

// Ruta para obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos.' });
  }
});

module.exports = router;
