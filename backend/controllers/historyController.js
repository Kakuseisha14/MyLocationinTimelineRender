const db = require('../config/db');

// 📌 Obtener todos los eventos históricos
exports.getAllHistoryEvents = (req, res) => {
  const sql = 'SELECT * FROM historia';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching history events:', err);
      return res.status(500).json({ message: 'Error al obtener eventos históricos' });
    }
    res.json(results);
  });
};

// 📌 Obtener un evento histórico por ID
exports.getHistoryEventById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM historia WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error fetching event:', err);
      return res.status(500).json({ message: 'Error al obtener el evento' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(result[0]);
  });
};

// 📌 Crear un nuevo evento histórico
exports.createHistoryEvent = (req, res) => {
  const { titulo, affected_personnel, fecha, fragmento } = req.body;
  const img = req.file ? req.file.filename : null;

  if (!titulo || !affected_personnel || !fecha || !fragmento) {
    return res.status(400).json({ message: '❌ Todos los campos son obligatorios' });
  }

  const sql = 'INSERT INTO historia (titulo, affected_personnel, fecha, fragmento, img) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [titulo, affected_personnel, fecha, fragmento, img], (err, result) => {
    if (err) {
      console.error('❌ Error inserting event:', err);
      return res.status(500).json({ message: 'Error al guardar el evento' });
    }
    res.status(201).json({ message: 'Evento registrado con éxito', id: result.insertId });
  });
};

// 📌 Actualizar un evento histórico
exports.updateHistoryEvent = (req, res) => {
  const { id } = req.params;
  const { titulo, affected_personnel, fecha, fragmento } = req.body;
  const img = req.file ? req.file.filename : null;

  if (!titulo || !affected_personnel || !fecha || !fragmento) {
    return res.status(400).json({ message: '❌ Todos los campos son obligatorios' });
  }

  const sql = 'UPDATE historia SET titulo = ?, affected_personnel = ?, fecha = ?, fragmento = ?, img = ? WHERE id = ?';
  db.query(sql, [titulo, affected_personnel, fecha, fragmento, img, id], (err, result) => {
    if (err) {
      console.error('❌ Error updating event:', err);
      return res.status(500).json({ message: 'Error al actualizar el evento' });
    }
    res.json({ message: 'Evento actualizado con éxito' });
  });
};

// 📌 Eliminar un evento histórico
exports.deleteHistoryEvent = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM historia WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting event:', err);
      return res.status(500).json({ message: 'Error al eliminar el evento' });
    }
    res.json({ message: 'Evento eliminado con éxito' });
  });
};