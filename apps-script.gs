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
const TURNSTILE_SECRET_KEY = '0x4AAAAAADGarXpvP1YxvR1zF8IMKuISrQ8'; // Cambiar por tu Secret Key real

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

// ── Verificar Cloudflare Turnstile ───────────────────────────────────
function verifyTurnstile(token) {
  if (!token) return false;
  
  // Si usas las llaves de prueba, Cloudflare siempre devuelve éxito.
  // Pero en producción, recordá poner las llaves reales en las constantes de arriba.
  try {
    const response = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post',
      payload: {
        secret:   TURNSTILE_SECRET_KEY,
        response: token
      }
    });
    
    const result = JSON.parse(response.getContentText());
    if (!result.success) {
      console.error('Turnstile Error:', result['error-codes']);
    }
    return result.success;
  } catch (e) {
    console.error('Error en fetch Turnstile:', e.toString());
    return false;
  }
}

// ── Recibir datos del formulario (POST) ──────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Verificar token (si se envía en el JSON)
    if (!verifyTurnstile(data.token)) {
       throw new Error('Verificación anti-bots fallida');
    }

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
      // Verificar token
      if (!verifyTurnstile(e.parameter.token)) {
         throw new Error('Verificación anti-bots fallida');
      }

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
