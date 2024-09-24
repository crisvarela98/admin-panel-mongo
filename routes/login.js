const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');  // Asegúrate de tener el modelo de usuario

// Ruta para procesar el inicio de sesión
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usuario.findOne({ username, password });
    if (user) {
      // Redirigir a menu.html si el inicio de sesión es correcto
      res.json({ success: true, redirectUrl: '/menu.html' });
    } else {
      // Mostrar mensaje de error si las credenciales no son correctas
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;
