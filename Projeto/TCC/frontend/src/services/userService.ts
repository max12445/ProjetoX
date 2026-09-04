import { api } from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: string;
  password?: string;
  currentPassword?: string;
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

export const getCurrentUser = async () => {
  const response = await api.get("/usuario/me");
  return response.data;
};

export const updateCurrentUser = async (id: string, data: UpdateProfileData) => {
  const response = await api.put(`/usuario/${id}`, data);
  return response.data;
};