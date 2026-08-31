export interface Product {
  _id: string; // ou 'id', dependendo de como o MongoDB retorna
  title: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  status?: "aprovado" | "pendente" | "rejeitado";
  comercianteId?: { name?: string; email?: string } | string | null;
  createdAt?: string;
  updatedAt?: string;
}
