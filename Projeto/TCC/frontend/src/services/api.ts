import axios from 'axios';

// Instância centralizada do Axios apontando para a sua porta do Backend
// A URL pode ser sobrescrita via VITE_API_URL no arquivo .env do frontend
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true, // envia cookies httpOnly (token de autenticação)
});