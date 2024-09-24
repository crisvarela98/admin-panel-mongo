const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  storeName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  zone: { type: String, required: true },
  locality: { type: String, required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
