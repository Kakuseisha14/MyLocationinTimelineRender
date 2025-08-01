//const { pool } = require('../config/db'); // Asegúrate que exportas `pool`
const pool = require('../config/db'); // ✅ Ya que exportaste pool directamente


// 📌 Obtener todos los eventos históricos
exports.getAllHistoryEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM historia');
    res.json(result.rows); // ✅ En PostgreSQL los datos están en result.rows
  } catch (err) {
    console.error('❌ Error fetching history events:', err);
    res.status(500).json({ message: 'Error al obtener eventos históricos' });
  }
};

// 📌 Obtener un evento histórico por ID
exports.getHistoryEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM historia WHERE id = $1', [id]); // ✅ $1 en PostgreSQL
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(result.rows[0]); // ✅ Solo el primer resultado
  } catch (err) {
    console.error('❌ Error fetching event:', err);
    res.status(500).json({ message: 'Error al obtener el evento' });
  }
};

// 📌 Crear un nuevo evento histórico
exports.createHistoryEvent = async (req, res) => {
  const { titulo, affected_personnel, fecha, fragmento } = req.body;
  const img = req.file ? req.file.filename : null;

  if (!titulo || !affected_personnel || !fecha || !fragmento) {
    return res.status(400).json({ message: '❌ Todos los campos son obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO historia (titulo, affected_personnel, fecha, fragmento, img) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`, // ✅ PostgreSQL RETURNING
      [titulo, affected_personnel, fecha, fragmento, img]
    );
    res.status(201).json({ message: 'Evento registrado con éxito', id: result.rows[0].id });
  } catch (err) {
    console.error('❌ Error inserting event:', err);
    res.status(500).json({ message: 'Error al guardar el evento' });
  }
};

// 📌 Actualizar un evento histórico
exports.updateHistoryEvent = async (req, res) => {
  const { id } = req.params;
  const { titulo, affected_personnel, fecha, fragmento } = req.body;
  const img = req.file ? req.file.filename : null;

  if (!titulo || !affected_personnel || !fecha || !fragmento) {
    return res.status(400).json({ message: '❌ Todos los campos son obligatorios' });
  }

  try {
    await pool.query(
      `UPDATE historia 
       SET titulo = $1, affected_personnel = $2, fecha = $3, fragmento = $4, img = $5 
       WHERE id = $6`,
      [titulo, affected_personnel, fecha, fragmento, img, id]
    );
    res.json({ message: 'Evento actualizado con éxito' });
  } catch (err) {
    console.error('❌ Error updating event:', err);
    res.status(500).json({ message: 'Error al actualizar el evento' });
  }
};

// 📌 Eliminar un evento histórico
exports.deleteHistoryEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM historia WHERE id = $1', [id]); // ✅ $1 en PostgreSQL
    res.json({ message: 'Evento eliminado con éxito' });
  } catch (err) {
    console.error('❌ Error deleting event:', err);
    res.status(500).json({ message: 'Error al eliminar el evento' });
  }
};
