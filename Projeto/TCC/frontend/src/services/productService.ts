import { api } from "./api";
import type { Product } from "../types/product";

// Exporta o tipo também para arquivos que já importavam Product daqui
export type { Product } from "../types/product";

export interface Paginated<T> {
  products?: T[];
  data?: T[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

export const getProducts = async (page = 1, limit = 12): Promise<Paginated<Product>> => {
  const response = await api.get("/produto", { params: { page, limit } });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/produto/${id}`);
  return response.data;
};

export const getPendingProducts = async (page = 1, limit = 20): Promise<Paginated<Product>> => {
  // ✅ Cookie httpOnly já é enviado automaticamente com withCredentials
  const response = await api.get("/produto/pendentes", { params: { page, limit } });
  return response.data;
};

export const createProduct = async (
  productData: Omit<Product, "_id">
) => {
  // ✅ A identidade (role e id) é extraída do JWT no backend, não do body.
  // O cookie httpOnly é enviado automaticamente.
  const response = await api.post("/produto", productData);

  return response.data;
};

export const updateProductStatus = async (
  id: string,
  status: "aprovado" | "rejeitado"
) => {
  // ✅ Cookie httpOnly já é enviado automaticamente
  const response = await api.patch(`/produto/${id}/status`, { status });

  return response.data;
};
