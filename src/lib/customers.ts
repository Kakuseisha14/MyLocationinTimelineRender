// src/lib/api/customers.ts

import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/customers`; // Backend

// Obtener todos los clientes
export const fetchCustomers = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Crear un nuevo cliente
export const createCustomer = async (customerData: any) => {
  const response = await axios.post(API_BASE_URL, customerData);
  return response.data;
};

// Actualizar un cliente
export const updateCustomer = async (id: string, customerData: any) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, customerData);
  return response.data;
};

// Eliminar un cliente
export const deleteCustomer = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
