import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "../types/product";

interface ProductContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    // Incrementa a chave para forçar re-fetch dos produtos
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <ProductContext.Provider value={{ products, setProducts, refreshKey, triggerRefresh }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext deve ser usado dentro de ProductProvider");
  }
  return context;
};
