import React, { useEffect, useState } from "react";
import { getAdminDashboard, type AdminDashboard } from "../services/orderService";
import { PriceTag } from "../components/PriceTag";
import { formatPrice } from "../utils/format";
import { EmptyState } from "../components/EmptyState";
import { BadgeStatus } from "../components/BadgeStatus";
import { CartIcon, PackageIcon, StoreIcon, UsersIcon, ZapIcon } from "../components/Icons";

const KpiCard: React.FC<{ label: string; value: React.ReactNode; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="rounded-2xl border border-line bg-white p-5 shadow-lift">
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm font-medium text-muted">{label}</span>
      <span className="text-brand-600 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
    </div>
    <div className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{value}</div>
  </div>
);

export const AdminOverview: React.FC = () => {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getAdminDashboard()
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("Não foi possível carregar o resumo do site.");
      });

    return () => {
      active = false;
    };
  }, []);

  if (data === null && !error) {
    return (
      <div className="mx-auto flex h-64 max-w-5xl items-center justify-center">
        <span className="text-sm font-medium text-muted">Carregando resumo do site...</span>
      </div>
    );
  }

  if (error || data === null) {
    return (
      <EmptyState
        icon={<StoreIcon />}
        title="Não conseguimos carregar o resumo do site"
        description={error || "Tente novamente em instantes."}
      />
    );
  }

  const maxRevenue = Math.max(1, ...data.vendasPorDia.map((d) => d.revenue));
  const statusTotal = data.pedidosPorStatus.reduce((sum, s) => sum + s.count, 0);
  const maxQty = Math.max(1, ...data.topProdutos.map((p) => p.qty));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Resumo do site</h1>
        <p className="mt-1 text-sm text-muted">
          Indicadores globais da Maxibuy: vendas, receita, usuários e lojas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Receita total"
          value={<PriceTag value={data.receitaTotal} size="md" />}
          icon={<ZapIcon />}
        />
        <KpiCard label="Vendas" value={data.totalVendas} icon={<CartIcon />} />
        <KpiCard
          label="Ticket médio"
          value={<PriceTag value={data.ticketMedio} size="md" />}
          icon={<PackageIcon />}
        />
        <KpiCard label="Itens vendidos" value={data.itensVendidos} icon={<PackageIcon />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Usuários cadastrados" value={data.totalUsuarios} icon={<UsersIcon />} />
        <KpiCard label="Produtos aprovados" value={data.totalProdutos} icon={<PackageIcon />} />
        <KpiCard label="Lojas ativas" value={data.totalLojas} icon={<StoreIcon />} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-lift">
          <h2 className="text-base font-bold text-ink">Vendas por dia (últimos 7 dias)</h2>
          {data.vendasPorDia.every((d) => d.count === 0) ? (
            <p className="mt-6 text-sm text-muted">Nenhuma venda registrada nesse período.</p>
          ) : (
            <div className="mt-6 flex h-44 items-end gap-2">
              {data.vendasPorDia.map((d) => (
                <div key={d.date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                  {d.count > 0 && (
                    <span className="text-[10px] font-bold text-brand-700">
                      {d.count}
                    </span>
                  )}
                  <div
                    className="w-full rounded-t-lg bg-brand-600 transition-all group-hover:bg-brand-700"
                    style={{
                      height: d.revenue > 0 ? Math.max(Math.round((d.revenue / maxRevenue) * 140), 6) : 2,
                    }}
                    title={formatPrice(d.revenue)}
                  />
                  <span className="text-[10px] font-medium text-muted">
                    {d.date.slice(8)}/{d.date.slice(5, 7)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-lift">
          <h2 className="text-base font-bold text-ink">Pedidos por status</h2>
          <div className="mt-4 space-y-4">
            {data.pedidosPorStatus.length === 0 ? (
              <p className="text-sm text-muted">Nenhum pedido registrado ainda.</p>
            ) : (
              data.pedidosPorStatus.map((item) => (
                <div key={item.status}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <BadgeStatus status={item.status} />
                    <span className="text-xs font-semibold text-muted">
                      {item.count} {item.count === 1 ? "pedido" : "pedidos"}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${statusTotal ? (item.count / statusTotal) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-lift">
        <h2 className="text-base font-bold text-ink">Produtos mais vendidos</h2>
        {data.topProdutos.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Nenhum produto vendido ainda.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {data.topProdutos.map((product, index) => (
              <div key={product.productId}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-ink">
                    <span className="mr-2 text-muted">#{String(index + 1).padStart(2, "0")}</span>
                    {product.title}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-muted">
                    {product.qty} {product.qty === 1 ? "unidade" : "unidades"}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-success"
                    style={{ width: `${(product.qty / maxQty) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;