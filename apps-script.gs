// ══════════════════════════════════════════════════════════════════════
//  Google Apps Script – Relevamiento Comercial Casilda
//  
//  INSTRUCCIONES:
//  1. Abrí script.google.com → "Nuevo proyecto"
//  2. Borrá el contenido y pegá TODO este código
//  3. Guardá (Ctrl+S), luego: Implementar → Nueva implementación
//     - Tipo: Aplicación web
//     - Ejecutar como: Yo (tu cuenta)
//     - Quién tiene acceso: Cualquier persona
//  4. Copiá la URL del Web App → pegala en config.js (SCRIPT_URL)
// ══════════════════════════════════════════════════════════════════════

const SHEET_NAME = 'Relevamiento';

const HEADERS = [
  'ID', 'Fecha', 'Nombre del comercio', 'Titular', 'Rubro / Actividad',
  'Teléfono', 'Email', 'Dirección', 'Barrio',
  'Actividades conjuntas', 'Capacitaciones', 'Temáticas', 'WhatsApp'
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0); // posición 0 = primera hoja

    // Encabezados con formato
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);
    headerRange.setBackground('#1a5c3a');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, HEADERS.length, 160);
  } else {
    // Asegurarse de que esté en primera posición
    ss.setActiveSheet(sheet);
    ss.moveActiveSheet(1);
  }

  return sheet;
}

// ── Recibir datos del formulario (POST) ──────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const sheet = getSheet();

    sheet.appendRow([
      data.id,
      data.fecha,
      data.nombre,
      data.titular,
      data.rubro,
      data.telefono,
      data.email       || '',
      data.direccion   || '',
      data.barrio      || '',
      data.actividades || '',
      data.capacitacion|| '',
      data.tematicas   || '',
      data.whatsapp    || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Registro guardado' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Recibir datos del formulario (GET con parámetros) ────────────────
function doGet(e) {
  // Escritura: ?action=write&data={...}
  if (e.parameter && e.parameter.action === 'write') {
    try {
      const data  = JSON.parse(e.parameter.data);
      const sheet = getSheet();

      sheet.appendRow([
        data.id,
        data.fecha,
        data.nombre,
        data.titular,
        data.rubro,
        data.telefono,
        data.email        || '',
        data.direccion    || '',
        data.barrio       || '',
        data.actividades  || '',
        data.capacitacion || '',
        data.tematicas    || '',
        data.whatsapp     || ''
      ]);

      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Lectura: devuelve todos los datos como JSON
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  return ContentService
    .createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}
