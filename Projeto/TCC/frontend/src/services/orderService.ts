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
      | { _id: string; title?: string; price?: number; image?: string; images?: string[] };
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
