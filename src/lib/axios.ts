import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/customers`, // Ajusta el puerto si es diferente
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
