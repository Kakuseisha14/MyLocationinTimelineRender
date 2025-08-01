const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Rutas
const customerRoutes = require('./routes/customerRoutes');
const historyRoutes = require('./routes/historyRoutes');

// Pool de PostgreSQL
const pool = require('./config/db');

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://veccit-frontend.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Probar conexión a PostgreSQL
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL exitosa desde server.js');
    client.release();
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    process.exit(1);
  }
})();

// Rutas
app.use('/api/customers', customerRoutes);
app.use('/api/history-events', historyRoutes);

app.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente con PostgreSQL. ¡Bienvenido a la API!');
});

// Rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: '❌ Ruta no encontrada' });
});

// Errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '❌ Error interno del servidor' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
