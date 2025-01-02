require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const compression = require('compression');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Verificar variables de entorno
const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, SPREADSHEET_ID } = process.env;
if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
  throw new Error('Faltan variables de entorno necesarias.');
}

// Configuración de Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// Middleware para compresión
app.use(compression());

// Middleware para procesar datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos con caché
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // Tiempo de caché (1 día)
}));

// Rutas para HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/policy.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'policy.html'));
});
app.get('/gracias.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'gracias.html'));
});

// Función de validación
const validateInput = (name, phone) => {
  const namePattern = /^[A-Za-z\s]+$/;
  const phonePattern = /^\+593\d{9}$/;
  if (!name || !namePattern.test(name)) {
    return 'Nombre inválido. Solo se permiten letras y espacios.';
  }
  if (!phonePattern.test(phone)) {
    return 'Número de teléfono inválido. Ejemplo: +593933543342';
  }
  return null;
};

// Ruta para manejar el envío del formulario
app.post('/submit', async (req, res, next) => {
  const { name, phone } = req.body;

  // Validar entrada
  const validationError = validateInput(name, phone);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const defaultData = 'Crystalin';
  const timestamp = new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' });

  try {
    // Enviar datos a Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Cliente!A:D',
      valueInputOption: 'RAW',
      resource: {
        values: [[name, phone, defaultData, timestamp]],
      },
    });

    // Redirigir a gracias.html tras el envío exitoso
    res.redirect('/gracias.html');
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    next(error);
  }
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor. Por favor, inténtelo más tarde.' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
