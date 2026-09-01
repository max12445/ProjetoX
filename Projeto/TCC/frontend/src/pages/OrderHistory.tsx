import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrdersByUser, type Order } from "../services/orderService";
import { getProductImages } from "../types/product";
import { useAuth } from "../context/AuthContext";
import { BadgeStatus } from "../components/BadgeStatus";
import { PriceTag } from "../components/PriceTag";
import { EmptyState } from "../components/EmptyState";
import { ChevronLeftIcon, PackageIcon } from "../components/Icons";
import { formatDate } from "../utils/format";

export const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (!user?.id) {
          setError("Você precisa estar logado para ver seus pedidos.");
          return;
        }
        const data = await getOrdersByUser(user.id);
        setOrders(data.orders ?? data.data ?? []);
        setError(null);
      } catch {
        setError("Não foi possível carregar seus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm font-medium text-muted">Buscando pedidos...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Meus pedidos
      </h1>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-danger-soft p-4 text-sm font-medium text-red-700">
          {error}
          <Link to="/" className="mt-2 block font-semibold text-brand-600 hover:underline">
            Voltar à loja
          </Link>
        </div>
      )}

      {!error && orders.length === 0 && (
        <EmptyState
          icon={<PackageIcon />}
          title="Você ainda não fez nenhum pedido"
          description="Explore a loja e comece suas compras hoje."
        >
          <Link
            to="/"
            className="inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700"
          >
            Começar a comprar
          </Link>
        </EmptyState>
      )}

      {!error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
                <div>
                  <p className="text-xs text-muted">Pedido #{order._id.slice(-8)}</p>
                  <p className="text-sm font-medium text-ink">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <BadgeStatus status={order.status} />
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {order.items.map((item, idx) => {
                    const product =
                      typeof item.product === "string" ? null : item.product;
                    const name = product?.title || "Produto";
                    const images = product ? getProductImages(product) : [];
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={images[0] ?? ""}
                          alt={name}
                          className="h-14 w-14 rounded-lg bg-surface object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">
                            {name}
                          </p>
                          <p className="text-xs text-muted">
                            {item.quantity}x <PriceTag value={item.price} size="sm" />
                          </p>
                        </div>
                        <PriceTag value={item.price * item.quantity} size="sm" />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-line pt-4 text-sm">
                  <div className="text-muted">
                    <p className="font-semibold text-ink">Endereço de entrega</p>
                    <p className="max-w-[280px] text-xs">{order.shippingAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink">Total</p>
                    <PriceTag value={order.totalPrice} size="lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Continuar comprando
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;