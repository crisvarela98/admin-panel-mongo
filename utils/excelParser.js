const xlsx = require('xlsx');

// Función para parsear archivos Excel a formato JSON
function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // Convertir la hoja a JSON
  const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: null });
  return jsonData;
}

module.exports = { parseExcel };
