import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ProductContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    // Incrementa a chave para forçar re-fetch dos produtos
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <ProductContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </ProductContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext deve ser usado dentro de ProductProvider");
  }
  return context;
};
