import { api } from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/usuario/register", data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post("/usuario/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/usuario/logout");
  return response.data;
};