const db = require('../config/db');

// Crear la tabla si no existe (opcional)
db.query(`
  CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error al crear la tabla Customers:', err.message);
  }
});

module.exports = {
  create: (customer, callback) => {
    const query = 'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)';
    db.query(query, [customer.name, customer.email, customer.phone, customer.address], callback);
  },
  getAll: (callback) => {
    db.query('SELECT * FROM customers', callback);
  },
  getById: (id, callback) => {
    db.query('SELECT * FROM customers WHERE id = ?', [id], callback);
  },
  update: (id, customer, callback) => {
    const query = 'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?';
    db.query(query, [customer.name, customer.email, customer.phone, customer.address, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM customers WHERE id = ?', [id], callback);
  },
};
