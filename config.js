// ══════════════════════════════════════════════════════════
//  CONFIGURACIÓN – Relevamiento Comercial Casilda
//  Completar las dos URLs según las instrucciones de setup.
// ══════════════════════════════════════════════════════════

const CONFIG = {

  // 1️⃣  URL del Web App de Google Apps Script (para GUARDAR datos)
  //     Obtenida en: Apps Script → Implementar → Nueva implementación → Web App
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyZUhdQPVzssVBDoa-SC3wq5rXk36gjr6Y0PytJy2Ps0ubWi10DUFDsvzt1ImlH3YUf/exec',

  // 2️⃣  URL CSV de Google Sheets publicada (para LEER datos en el dashboard)
  //     Obtenida en: Sheets → Archivo → Compartir → Publicar en la web → CSV
  CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS1S2QZMdT3guDJPPwNsvL-DZQP7g3NxgfKOtgp6ZSTNUWxMHoyQ2P2EnBESlYhXkeXtQjpTRCXC0IL/pub?output=csv',

  // 3️⃣  Cloudflare Turnstile Site Key (Seguridad Anti-Bots)
  //     Obtenida en: Cloudstile Dashboard → Turnstile → Add Site
  TURNSTILE_SITE_KEY: '0x4AAAAAADGarY_sWHDLnlme' // Cambiar por tu Site Key real

};
