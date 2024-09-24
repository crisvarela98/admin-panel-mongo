const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware para permitir la subida de archivos
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB Atlas
const uri = "mongodb+srv://crisvarela98:8RhsLRfAy0UHpMlW@adminsgppanel.fwdca.mongodb.net/adminSGPpanel";
mongoose.connect(uri)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
  })
  .catch((error) => {
    console.log('Error conectando a MongoDB:', error);
  });

// Redirigir a login.html si acceden a la raíz "/"
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Importar las rutas desde la carpeta routes
const clientesRouter = require('./routes/clientes');
const productosRouter = require('./routes/productos');
const loginRouter = require('./routes/login');
const pedidosRouter = require('./routes/pedidos');

// Uso de las rutas
app.use('/clientes', clientesRouter);
app.use('/productos', productosRouter);
app.use('/login', loginRouter);
app.use('/pedidos', pedidosRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
