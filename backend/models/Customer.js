//import { pool } from '../config/db.js';
const pool = require('../config/db');


// Crear la tabla si no existe (PostgreSQL usa SERIAL en lugar de AUTO_INCREMENT)
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(15),
        address VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "customers" verificada/creada correctamente');
  } catch (err) {
    console.error('❌ Error al crear la tabla Customers:', err.message);
  }
};
createTable();

// ✅ Exportamos métodos basados en Promesas
export const create = async (customer) => {
  const query = `
    INSERT INTO customers (name, email, phone, address) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [customer.name, customer.email, customer.phone, customer.address];
  const result = await pool.query(query, values);
  return result.rows[0]; // Devuelve el cliente creado
};

export const getAll = async () => {
  const result = await pool.query('SELECT * FROM customers ORDER BY id DESC');
  return result.rows;
};

export const getById = async (id) => {
  const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
  return result.rows[0];
};

export const update = async (id, customer) => {
  const query = `
    UPDATE customers 
    SET name=$1, email=$2, phone=$3, address=$4 
    WHERE id=$5 RETURNING *`;
  const values = [customer.name, customer.email, customer.phone, customer.address, id];
  const result = await pool.query(query, values);
  return result.rows[0]; // Devuelve el actualizado
};

export const remove = async (id) => {
  await pool.query('DELETE FROM customers WHERE id = $1', [id]);
  return { message: 'Customer deleted' };
};
