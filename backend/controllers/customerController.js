const Customer = require('../models/customerModel');

exports.getAllCustomers = (req, res) => {
  Customer.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCustomerById = (req, res) => {
  const { id } = req.params;
  Customer.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json(results[0]);
  });
};

exports.createCustomer = (req, res) => {
  const newCustomer = req.body;
  Customer.create(newCustomer, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Customer created successfully', id: results.insertId });
  });
};

exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const updatedCustomer = req.body;
  Customer.update(id, updatedCustomer, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Customer updated successfully' });
  });
};

exports.deleteCustomer = (req, res) => {
  const { id } = req.params;
  Customer.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Customer deleted successfully' });
  });
};
