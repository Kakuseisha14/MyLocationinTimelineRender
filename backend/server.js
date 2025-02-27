require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const historyRoutes = require('./routes/historyRoutes');
const db = require('./config/db');

const app = express();

// ✅ Configurar CORS
app.use(cors({
  origin: 'http://localhost:3000', // Permitir solicitudes desde tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true // Permitir cookies y encabezados de autorización
}));

// ✅ Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para manejar formularios con datos codificados en URL
// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
    process.exit(1); // Salir si no hay conexión con la base de datos
  }
  console.log('✅ Connected to MySQL');
});

// ✅ Rutas principales
app.use('/api/customers', customerRoutes);
app.use('/api/history-events', historyRoutes);


// ✅ Ruta principal
app.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente. ¡Bienvenido a la API!');
});

// ✅ Manejador para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: '❌ Ruta no encontrada' });
});

// ✅ Middleware global para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '❌ Error interno del servidor' });
});

// ✅ Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});