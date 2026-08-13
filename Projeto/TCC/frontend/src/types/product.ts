export interface Product {
    _id: string; // ou 'id', dependendo de como o MongoDB retorna
    title: string;
    category: string;
    price: number;
    image: string;
  }