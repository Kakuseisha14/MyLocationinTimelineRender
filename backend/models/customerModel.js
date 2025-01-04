const db = require('../config/db');

// Crear el modelo Customer (CRUD básico)
const Customer = {
  getAll: (callback) => {
    db.query('SELECT * FROM customers', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM customers WHERE id = ?', [id], callback);
  },

  create: (customerData, callback) => {
    db.query('INSERT INTO customers SET ?', customerData, callback);
  },

  update: (id, customerData, callback) => {
    db.query('UPDATE customers SET ? WHERE id = ?', [customerData, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM customers WHERE id = ?', [id], callback);
  }
};

module.exports = Customer;
