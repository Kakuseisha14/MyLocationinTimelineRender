
const pool = require('../config/db');

const Customer = {
  getAll: (callback) => {
    pool.query('SELECT * FROM customers', [], (err, res) => {
      if (err) return callback(err);
      callback(null, res.rows);
    });
  },

  getById: (id, callback) => {
    pool.query('SELECT * FROM customers WHERE id = $1', [id], (err, res) => {
      if (err) return callback(err);
      callback(null, res.rows);
    });
  },

  create: (customerData, callback) => {
    const { name, email, phone, address } = customerData;
    const sql = `INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING id`;
    pool.query(sql, [name, email, phone, address], (err, res) => {
      if (err) return callback(err);
      callback(null, { insertId: res.rows[0].id });
    });
  },

  update: (id, customerData, callback) => {
    const { name, email, phone, address } = customerData;
    const sql = `UPDATE customers SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5`;
    pool.query(sql, [name, email, phone, address, id], (err, res) => {
      if (err) return callback(err);
      callback(null);
    });
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM customers WHERE id = $1';
    pool.query(sql, [id], (err, res) => {
      if (err) return callback(err);
      callback(null);
    });
  }
};

module.exports = Customer;
