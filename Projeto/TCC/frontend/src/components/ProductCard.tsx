import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { getProductImage } from "../types/product";
import { PriceTag } from "./PriceTag";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const outOfStock = typeof product.stock === "number" && product.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lift transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <img
          src={getProductImage(product)}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-bold text-white">
            Esgotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {product.category}
          </span>
          <h3 className="mt-1 line-clamp-2 font-semibold text-ink">
            {product.title}
          </h3>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <PriceTag value={product.price} size="md" />
          <Link
            to={`/produto/${product._id}`}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};