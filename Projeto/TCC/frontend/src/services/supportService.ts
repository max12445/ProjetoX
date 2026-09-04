import { api } from "./api";

export interface SupportMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SupportMessage extends SupportMessageInput {
  _id: string;
  status: "aberto" | "respondido" | "resolvido";
  user: string | { name?: string; email?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedSupport {
  messages?: SupportMessage[];
  data?: SupportMessage[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

export const createSupportMessage = async (
  data: SupportMessageInput
): Promise<{ message: string }> => {
  const response = await api.post("/suporte", data);
  return response.data;
};

export const getSupportMessages = async (
  page = 1,
  limit = 20
): Promise<PaginatedSupport> => {
  const response = await api.get("/suporte", { params: { page, limit } });
  return response.data;
};

export const updateSupportMessageStatus = async (
  id: string,
  status: "aberto" | "respondido" | "resolvido"
) => {
  const response = await api.patch(`/suporte/${id}`, { status });
  return response.data;
};