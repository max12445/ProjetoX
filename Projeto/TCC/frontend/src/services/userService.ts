import axios from "axios";

const API_URL = "http://localhost:3001/usuario";

export interface RegisterData {
  nome: string; // ou 'name' se o seu Controller no backend esperar em inglês
  email: string;
  senha: string; // ou 'password' se o seu Controller no backend esperar em inglês
}

export const registerUser = async (data: RegisterData) => {
  // Ajustado para chamar /register
  const response = await axios.post(`${API_URL}/register`, {
    name: data.nome,
    email: data.email,
    password: data.senha,
  });
  return response.data;
};

export const loginUser = async (data: { email: string; senha: string }) => {
  const response = await axios.post(`${API_URL}/login`, {
    email: data.email,
    password: data.senha,
  });
  return response.data;
};