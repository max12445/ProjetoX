import React from "react";
import type { StoreProfile } from "../services/productService";

interface StoreCardProps {
  store: StoreProfile;
  productCount: number;
}

const storeInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

export const StoreCard: React.FC<StoreCardProps> = ({ store, productCount }) => (
  <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-lift">
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
      {storeInitials(store.name)}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
        Loja
      </p>
      <h3 className="truncate text-lg font-bold text-ink">{store.name}</h3>
      <p className="truncate text-sm text-muted">{store.email}</p>
    </div>
    <div className="text-right">
      <p className="text-xl font-bold text-brand-600">{productCount}</p>
      <p className="text-xs text-muted">
        {productCount === 1 ? "item na loja" : "itens na loja"}
      </p>
    </div>
  </div>
);