import axios from "axios";
import type { Product } from "../types/product";

// Exporta o tipo também para arquivos que já importavam Product daqui
export type { Product } from "../types/product";

const API_URL = "http://localhost:3001/produto";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPendingProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/pendentes`);
  return response.data;
};

export const createProduct = async (
  productData: Omit<Product, "_id">
) => {
  const userStored = localStorage.getItem("user");
  const user = userStored ? JSON.parse(userStored) : null;

  const response = await axios.post(API_URL, {
    ...productData,
    userRole: user?.role || "cliente",
    userId: user?.id || user?._id || null,
  });

  return response.data;
};

export const updateProductStatus = async (
  id: string,
  status: "aprovado" | "rejeitado"
) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    { status }
  );

  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);

  return response.data;
};