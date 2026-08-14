import axios from 'axios';

// Instância centralizada do Axios apontando para a sua porta do Backend
export const api = axios.create({
  baseURL: 'http://localhost:3001', // porta do backend express
});