import { api } from "./api";

export interface OrderItemInput {
  product: string;
  quantity: number;
}

export interface CreateOrderData {
  items: OrderItemInput[];
  shippingAddress: string;
  paymentMethod: "cartao" | "pix" | "boleto";
}

export interface Order {
  _id: string;
  user: string | { name?: string; email?: string };
  items: Array<{
    product:
      | string
      | {
          _id: string;
          title?: string;
          price?: number;
          image?: string;
          images?: string[];
          comercianteId?: string;
        };
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  shippingAddress: string;
  paymentMethod?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MerchantDashboard {
  totalVendas: number;
  receitaTotal: number;
  ticketMedio: number;
  itensVendidos: number;
  pedidosPorStatus: Array<{ status: string; count: number }>;
  vendasPorDia: Array<{ date: string; count: number; revenue: number }>;
  topProdutos: Array<{ productId: string; title: string; qty: number }>;
}

export interface AdminDashboard extends MerchantDashboard {
  totalUsuarios: number;
  totalProdutos: number;
  totalLojas: number;
}

export interface PaginatedOrders<T> {
  orders?: T[];
  data?: T[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

export const createOrder = async (data: CreateOrderData): Promise<{ message: string; order: Order }> => {
  const response = await api.post("/pedido", data);
  return response.data;
};

export const getOrders = async (page = 1, limit = 20): Promise<PaginatedOrders<Order>> => {
  const response = await api.get("/pedido", { params: { page, limit } });
  return response.data;
};

export const getOrdersByUser = async (
  userId: string,
  page = 1,
  limit = 20
): Promise<PaginatedOrders<Order>> => {
  const response = await api.get(`/pedido/usuario/${userId}`, { params: { page, limit } });
  return response.data;
};

export const getMerchantOrders = async (
  page = 1,
  limit = 20
): Promise<PaginatedOrders<Order>> => {
  const response = await api.get("/pedido/comerciante", { params: { page, limit } });
  return response.data;
};

export const getMerchantDashboard = async (): Promise<MerchantDashboard> => {
  const response = await api.get("/pedido/comerciante/dashboard");
  return response.data;
};

export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const response = await api.get("/pedido/admin/dashboard");
  return response.data;
};

export const updateOrderStatus = async (
  id: string,
  status: "pendente" | "processando" | "enviado" | "entregue" | "cancelado"
): Promise<{ message: string; order: Order }> => {
  const response = await api.put(`/pedido/${id}`, { status });
  return response.data;
};
