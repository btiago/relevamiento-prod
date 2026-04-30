# 🛠️ Guía de configuración – Google Sheets

## Archivos del proyecto

```
formularios/
├── index.html        ← Formulario de carga
├── dashboard.html    ← Dashboard estadísticas
├── config.js         ← ⚙️ ÚNICO archivo a completar
├── apps-script.gs    ← Código a pegar en Google Apps Script
└── assets/
    └── logo.png
```

---

## Paso 1 – Crear la Google Sheet

1. Ir a [sheets.google.com](https://sheets.google.com) → **Hoja en blanco**
2. Renombrarla como `Relevamiento Comercial Casilda`
3. **Dejar la hoja vacía** (el script crea los encabezados automáticamente)

---

## Paso 2 – Crear el Web App (Apps Script)

1. Dentro de la Sheet: **Extensiones → Apps Script**
2. Borrar el contenido y **pegar todo el código de `apps-script.gs`**
3. Guardar (`Ctrl+S`)
4. Click en **"Implementar" → "Nueva implementación"**
5. Configurar así:
   - **Tipo:** Aplicación web
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier persona
6. Click **"Implementar"** → autorizar permisos
7. **Copiar la URL del Web App** (empieza con `https://script.google.com/macros/s/...`)

---

## Paso 3 – Publicar la Sheet como CSV

1. En la Google Sheet: **Archivo → Compartir → Publicar en la web**
2. Seleccionar:
   - Hoja: `Relevamiento`
   - Formato: **Valores separados por comas (.csv)**
3. Click **"Publicar"** → confirmar
4. **Copiar la URL CSV** generada (empieza con `https://docs.google.com/spreadsheets/d/...`)

---

## Paso 4 – Completar `config.js`

Abrir `config.js` y reemplazar los placeholders:

```javascript
const CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/XXXXXXXXXX/exec',  // ← URL del Paso 2
  CSV_URL:    'https://docs.google.com/spreadsheets/d/XXXXXXXXXX/pub?output=csv', // ← URL del Paso 3
  TURNSTILE_SITE_KEY: '1x00000000000000000000AA' // ← Site Key de Cloudflare
};
```

---

## Paso 5 – Configurar Cloudflare Turnstile (Seguridad Anti-Bots)

Para evitar envíos automáticos de bots:
1. Creá una cuenta en [Cloudflare](https://dash.cloudflare.com/)
2. Ir a **Turnstile** → **Add Site**
3. Nombre: `Relevamiento Casilda`, Dominio: (el dominio donde lo subas o `localhost`)
4. Copiá la **Site Key** y pegala en `config.js`
5. Copiá la **Secret Key** y pegala en `apps-script.gs` (al principio del archivo)
6. **Importante:** Si cambiás el código en Apps Script, recordá volver a **Implementar → Gestionar implementaciones → Editar → Versión: Nueva** para que los cambios tengan efecto.

---

## ✅ Listo

- Cada vez que se guarda un formulario → los datos van directo a la Sheet
- El dashboard lee los datos en tiempo real desde la Sheet publicada
- El botón **"Exportar Excel"** descarga los datos con hoja de resumen

---

## ⚠️ Notas importantes

- El formulario necesita **conexión a internet** para guardar en Google Sheets
- Los datos también se guardan en `localStorage` del navegador como respaldo offline
- Si necesitás acceso desde varias PCs, **compartí la carpeta `formularios/` en la red local** o subila a un servidor web simple
- Al actualizar la implementación del Apps Script, siempre elegir **"Gestionar implementaciones" → editar** para mantener la misma URL
