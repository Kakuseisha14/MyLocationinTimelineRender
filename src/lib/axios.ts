import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/customers', // Ajusta el puerto si es diferente
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
