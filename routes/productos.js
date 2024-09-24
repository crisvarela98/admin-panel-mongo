const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const { parseExcel } = require('../utils/excelParser');
const path = require('path');

// Ruta para subir el Excel de productos e insertarlos o actualizarlos en MongoDB
router.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ success: false, message: 'No se ha enviado ningún archivo.' });
  }

  const excelFile = req.files.file;
  const filePath = path.join(__dirname, '../uploads', excelFile.name);

  try {
    await excelFile.mv(filePath);
    const productsData = parseExcel(filePath);

    const validKeys = ['Codigo', 'Sinonimo', 'EAN', 'Familia1', 'Familia2', 'Descripcion', 'UniBulto', 'PrecioLista', 'Oferta', 'Marca'];
    const isValid = productsData.every(product => validKeys.every(key => product.hasOwnProperty(key)));

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Estructura del archivo no válida.' });
    }

    const operations = productsData.map(product => ({
      updateOne: {
        filter: { Codigo: product.Codigo },
        update: { $set: product },
        upsert: true
      }
    }));

    await Producto.bulkWrite(operations);

    res.json({ success: true, message: 'Productos actualizados/cargados con éxito en MongoDB.' });
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    res.status(500).json({ success: false, message: 'Error al procesar el archivo.' });
  }
});

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos.' });
  }
});

// Ruta para eliminar productos duplicados
router.get('/eliminar-duplicados', async (req, res) => {
  try {
    // Agrupa los productos por "Codigo" y cuenta cuántos hay de cada uno
    const duplicados = await Producto.aggregate([
      { $group: { _id: "$Codigo", count: { $sum: 1 }, docs: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } } // Filtra los que tienen más de 1 coincidencia
    ]);

    // Elimina los duplicados manteniendo solo uno
    for (let item of duplicados) {
      // Mantén el primer documento y elimina el resto
      await Producto.deleteMany({ _id: { $in: item.docs.slice(1) } });
    }

    res.json({ success: true, message: 'Duplicados eliminados con éxito.' });
  } catch (error) {
    console.error('Error eliminando duplicados:', error);
    res.status(500).json({ success: false, message: 'Error eliminando duplicados.' });
  }
});

module.exports = router;
