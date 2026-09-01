import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductImages } from "../types/product";
import { PriceTag } from "../components/PriceTag";
import { EmptyState } from "../components/EmptyState";
import { CartIcon, ChevronLeftIcon, MinusIcon, PlusIcon, TrashIcon } from "../components/Icons";

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="px-4 py-16">
        <EmptyState
          icon={<CartIcon />}
          title="Seu carrinho está vazio"
          description="Que tal explorar nossas novidades?"
        >
          <Link
            to="/"
            className="inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700"
          >
            Ver produtos
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Meu carrinho
      </h1>
      <p className="mb-8 mt-1 text-sm text-muted">
        {totalItems} {totalItems === 1 ? "item" : "itens"} no carrinho
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const images = getProductImages(item.product);
            const imageUrl = images[0] ?? "";
            return (
              <div
                key={item.product._id}
                className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-lift"
              >
                <img
                  src={imageUrl}
                  alt={item.product.title}
                  className="h-24 w-24 rounded-xl bg-surface object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/produto/${item.product._id}`}
                        className="text-sm font-semibold text-ink transition-colors hover:text-brand-600"
                      >
                        {item.product.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger-soft hover:text-danger"
                        title="Remover"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                      {item.product.category}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-xl border border-line">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="rounded-l-xl px-3 py-1.5 text-muted transition-colors hover:bg-surface hover:text-ink"
                        aria-label="Diminuir quantidade"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="min-w-[40px] border-x border-line px-3 py-1.5 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="rounded-r-xl px-3 py-1.5 text-muted transition-colors hover:bg-surface hover:text-ink"
                        aria-label="Aumentar quantidade"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <PriceTag value={Number(item.product.price) * item.quantity} size="md" />
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Continuar comprando
          </Link>
        </div>

        {/* Resumo */}
        <div className="h-fit rounded-2xl border border-line bg-white p-6 shadow-lift">
          <h2 className="mb-4 text-lg font-bold text-ink">Resumo do pedido</h2>

          <div className="mb-4 space-y-2 text-sm text-muted">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-ink">
                <PriceTag value={totalPrice} size="sm" />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span className="font-semibold text-green-700">Grátis</span>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between border-t border-line pt-4">
            <span className="font-semibold text-ink">Total</span>
            <PriceTag value={totalPrice} size="lg" />
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700"
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;