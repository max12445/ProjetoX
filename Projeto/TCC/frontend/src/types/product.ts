export interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  image?: string;
  images?: string[];
  description?: string;
  stock?: number;
  status?: "aprovado" | "pendente" | "rejeitado";
  comercianteId?: { name?: string; email?: string } | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImageSource {
  image?: string;
  images?: string[];
}

export const getProductImages = (product: ImageSource): string[] => {
  if (product.images && product.images.length > 0) {
    return product.images;
  }
  if (product.image) {
    return [product.image];
  }
  return [];
};

export const getProductImage = (product: ImageSource): string => {
  const images = getProductImages(product);
  return images[0] ?? "";
};
