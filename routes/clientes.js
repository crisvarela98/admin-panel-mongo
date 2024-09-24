const express = require('express');
const router = express.Router();
const Cliente = require('../models/cliente');
const { parseExcel } = require('../utils/excelParser');
const path = require('path');

// Ruta para subir el Excel de clientes
router.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ success: false, message: 'No se ha enviado ningún archivo.' });
  }

  const excelFile = req.files.file;
  const filePath = path.join(__dirname, '../uploads', excelFile.name);

  try {
    await excelFile.mv(filePath);
    const clientsData = parseExcel(filePath);

    const validKeys = ['id', 'name', 'email', 'storeName', 'address', 'phone', 'zone', 'locality'];
    const isValid = clientsData.every(client => validKeys.every(key => client.hasOwnProperty(key)));

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Estructura del archivo no válida.' });
    }

    const operations = clientsData.map(client => ({
      updateOne: {
        filter: { id: client.id },
        update: { $set: client },
        upsert: true
      }
    }));

    await Cliente.bulkWrite(operations);

    res.json({ success: true, message: 'Clientes actualizados/cargados con éxito en MongoDB.' });
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    res.status(500).json({ success: false, message: 'Error al procesar el archivo.' });
  }
});

// Ruta para obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ message: 'Error al obtener los clientes.' });
  }
});

// Ruta para eliminar duplicados de clientes
router.get('/eliminar-duplicados', async (req, res) => {
  try {
    // Agrupa los clientes por "email" (o cualquier otro campo único) y cuenta cuántos hay de cada uno
    const duplicados = await Cliente.aggregate([
      { $group: { _id: "$email", count: { $sum: 1 }, docs: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } } // Filtra los que tienen más de 1 coincidencia
    ]);

    // Elimina los duplicados manteniendo solo uno
    for (let item of duplicados) {
      // Mantén el primer documento y elimina el resto
      await Cliente.deleteMany({ _id: { $in: item.docs.slice(1) } });
    }

    res.json({ success: true, message: 'Duplicados de clientes eliminados con éxito.' });
  } catch (error) {
    console.error('Error eliminando duplicados de clientes:', error);
    res.status(500).json({ success: false, message: 'Error eliminando duplicados de clientes.' });
  }
});

module.exports = router;
