import axios from "axios";
import type { Product } from "../types/product";

// Exporta o tipo também para arquivos que já importavam Product daqui
export type { Product } from "../types/product";

const API_URL = "http://localhost:3001/produto";

// ✅ Função auxiliar para obter headers com token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getPendingProducts = async (): Promise<Product[]> => {
  // ✅ Incluir token para endpoint protegido
  const response = await axios.get(`${API_URL}/pendentes`, getAuthHeaders());
  return response.data;
};

export const createProduct = async (
  productData: Omit<Product, "_id">
) => {
  const userStored = localStorage.getItem("user");
  const user = userStored ? JSON.parse(userStored) : null;
  const token = localStorage.getItem("token");

  // ✅ Validar se token existe antes de fazer requisição
  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  const response = await axios.post(
    API_URL,
    {
      ...productData,
      userRole: user?.role || "cliente",
      userId: user?.id || user?._id || null,
    },
    {
      // ✅ Incluir token no header Authorization
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateProductStatus = async (
  id: string,
  status: "aprovado" | "rejeitado"
) => {
  // ✅ Incluir token para endpoint protegido
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    { status },
    getAuthHeaders()
  );

  return response.data;
};

export const deleteProduct = async (id: string) => {
  // ✅ Incluir token para endpoint protegido
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};
