const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }  // Por defecto el rol será 'user', pero puede ser 'admin'
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
