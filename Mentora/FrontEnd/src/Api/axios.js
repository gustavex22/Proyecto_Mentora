import axios from 'axios';

const api = axios.create({
  // Aquí pones la URL de tu backend de Node.js
  baseURL: 'http://localhost:3977/api/v1', 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;