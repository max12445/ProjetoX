import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, updateOrderStatus, type Order, type OrderFilters } from "../services/orderService";
import { BadgeStatus } from "../components/BadgeStatus";
import { EmptyState } from "../components/EmptyState";
import { PriceTag } from "../components/PriceTag";
import { formatDate } from "../utils/format";
import { ChevronLeftIcon, ClockIcon, PackageIcon, SearchIcon } from "../components/Icons";

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "processando", label: "Processando" },
  { value: "enviado", label: "Enviado" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
] as const;

type OrderStatus = (typeof STATUS_OPTIONS)[number]["value"];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const fetchOrders = useCallback(async (page = 1, filters?: OrderFilters) => {
    try {
      setLoading(true);
      const data = await getOrders(page, 20, filters);
      setOrders(data.orders ?? data.data ?? []);
      setPagination(data.pagination ?? { page: 1, totalPages: 1, total: 0 });
      setError(null);
    } catch {
      setError("Não foi possível carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  const handleFilter = () => {
    fetchOrders(1, { status: statusFilter || undefined, search: searchFilter || undefined });
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setSearchFilter("");
    fetchOrders(1);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      setError("Erro ao atualizar status do pedido.");
    } finally {
      setUpdatingId(null);
    }
  };

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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
          <ClockIcon className="h-4 w-4" />
          Painel do admin
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
          Gerenciar Pedidos
        </h1>
        <p className="mt-1 text-sm text-muted">
          Visualize e atualize o status de todos os pedidos da plataforma.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 shadow-lift">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Total de pedidos
            </p>
            <p className="mt-1 text-2xl font-bold text-ink">{pagination.total}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <PackageIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-4 shadow-lift">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">Todos</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
            Buscar cliente
          </label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFilter()}
              placeholder="Nome ou email..."
              className="w-full rounded-xl border border-line bg-surface pl-9 pr-3 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Filtrar
          </button>
          <button
            onClick={handleClearFilters}
            className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            Limpar
          </button>
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
          title="Nenhum pedido encontrado"
          description="Quando clientes realizarem pedidos, eles aparecerão aqui."
        />
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
              const isUpdating = updatingId === order._id;

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
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value as OrderStatus)
                        }
                        disabled={isUpdating}
                        className="rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
                        aria-label={`Status do pedido ${order._id.slice(-8)}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="space-y-2">
                      {order.items.map((item, idx) => {
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
                    onClick={() => fetchOrders(page, { status: statusFilter || undefined, search: searchFilter || undefined })}
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
