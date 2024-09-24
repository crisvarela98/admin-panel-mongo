const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  Codigo: { type: String, required: true },
  Sinonimo: { type: String, required: true },
  EAN: { type: String, required: true },
  Familia1: { type: String, required: true },
  Familia2: { type: String, required: false },
  Descripcion: { type: String, required: true },
  UniBulto: {type: Number, required: true },
  PrecioLista: {type: Number, required: true },
  Oferta: { type: String, required: true },
  Marca: { type: String, required: true }
});

module.exports = mongoose.model('Producto', ProductoSchema);
