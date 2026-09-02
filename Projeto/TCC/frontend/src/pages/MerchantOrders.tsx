import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMerchantOrders, type Order } from "../services/orderService";
import { BadgeStatus } from "../components/BadgeStatus";
import { EmptyState } from "../components/EmptyState";
import { PriceTag } from "../components/PriceTag";
import { formatDate } from "../utils/format";
import { ChevronLeftIcon, PackageIcon, StoreIcon } from "../components/Icons";

export const MerchantOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const data = await getMerchantOrders(page);
      setOrders(data.orders ?? data.data ?? []);
      setPagination(data.pagination ?? { page: 1, totalPages: 1, total: 0 });
      setError(null);
    } catch {
      setError("Não foi possível carregar seus pedidos de venda.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm font-medium text-muted">Carregando pedidos...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
          <StoreIcon className="h-4 w-4" />
          Minha loja
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
          Minhas Vendas
        </h1>
        <p className="mt-1 text-sm text-muted">
          Pedidos que contêm seus produtos. Acompanhe o status de cada venda.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 shadow-lift">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Total de vendas
            </p>
            <p className="mt-1 text-2xl font-bold text-ink">{pagination.total}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <PackageIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-danger-soft p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          icon={<PackageIcon />}
          title="Nenhuma venda realizada"
          description="Quando clientes comprarem seus pedidos, eles aparecerão aqui."
        >
          <Link
            to="/meus-produtos"
            className="inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700"
          >
            Ver meus produtos
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => {
              const userName =
                typeof order.user === "object" && order.user
                  ? order.user.name
                  : "Cliente";
              const userEmail =
                typeof order.user === "object" && order.user
                  ? order.user.email
                  : "";

              // Filtra apenas os itens que pertencem a este comerciante
              const merchantItems = order.items.filter((item) => {
                const product = item.product;
                return (
                  typeof product === "object" &&
                  product &&
                  "comercianteId" in product
                );
              });

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
                    <div>
                      <p className="text-xs text-muted">Pedido #{order._id.slice(-8)}</p>
                      <p className="text-sm font-medium text-ink">
                        {userName}
                        {userEmail && (
                          <span className="ml-2 text-xs text-muted">({userEmail})</span>
                        )}
                      </p>
                      <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <BadgeStatus status={order.status} />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="space-y-2">
                      {merchantItems.map((item, idx) => {
                        const product =
                          typeof item.product === "string" ? null : item.product;
                        const name = product?.title || "Produto";
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-lg bg-surface" />
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
                        <p className="font-semibold text-ink">Entrega</p>
                        <p className="max-w-[280px] text-xs">{order.shippingAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-ink">Total</p>
                        <PriceTag value={order.totalPrice} size="lg" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => fetchOrders(page)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      page === pagination.page
                        ? "bg-brand-600 text-white shadow-lift"
                        : "bg-surface text-muted hover:bg-brand-50 hover:text-brand-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Voltar à loja
          </Link>
        </>
      )}
    </div>
  );
};
