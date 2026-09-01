import React, { useCallback, useEffect, useState } from "react";
import {
  getPendingProducts,
  updateProductStatus,
  type Product,
} from "../services/productService";
import { useProductContext } from "../context/ProductContext";
import { getProductImage } from "../types/product";
import { PriceTag } from "../components/PriceTag";
import { EmptyState } from "../components/EmptyState";
import { CheckIcon, ClockIcon, XIcon } from "../components/Icons";

export const AdminDashboard: React.FC = () => {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { triggerRefresh } = useProductContext();

  const fetchPendingProducts = useCallback(async () => {
    try {
      const data = await getPendingProducts();
      setPendingProducts(data.products ?? data.data ?? []);
      setError(null);
    } catch (error) {
      console.error("Falha ao buscar produtos pendentes:", error);
      setError("Não foi possível carregar a lista de produtos pendentes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPendingProducts();
  }, [fetchPendingProducts]);

  const handleStatusUpdate = async (id: string, status: "aprovado" | "rejeitado") => {
    try {
      setActionLoadingId(id);
      await updateProductStatus(id, status);
      setPendingProducts((prev) => prev.filter((product) => product._id !== id));

      if (status === "aprovado") {
        triggerRefresh();
      }
    } catch (error) {
      console.error("Erro ao atualizar status do produto:", error);
      alert(`Erro ao tentar ${status === "aprovado" ? "aprovar" : "rejeitar"} o produto.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm font-medium text-muted">
          Carregando painel do administrador...
        </span>
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
          Aprovação de produtos
        </h1>
        <p className="mt-1 text-sm text-muted">
          Analise e gerencie os produtos submetidos pelos comerciantes antes de
          exibi-los na loja.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 shadow-lift">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Pendente de análise
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {pendingProducts.length}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ClockIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-danger-soft p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {pendingProducts.length === 0 ? (
        <EmptyState
          icon={<CheckIcon />}
          title="Tudo limpo por aqui!"
          description="Não há produtos pendentes de aprovação no momento."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingProducts.map((product) => {
            const isProcessing = actionLoadingId === product._id;

            return (
              <div
                key={product._id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-surface">
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lift">
                      Pendente
                    </span>
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-lift backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="truncate text-lg font-bold text-ink" title={product.title}>
                      {product.title}
                    </h3>

                    {product.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                      <span className="text-xs font-medium text-muted">
                        Preço sugerido
                      </span>
                      <PriceTag value={product.price} size="md" contrast="success" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-line bg-surface p-4">
                  <button
                    onClick={() => product._id && handleStatusUpdate(product._id, "rejeitado")}
                    disabled={isProcessing}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-danger-soft py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 ${
                      isProcessing ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <XIcon className="h-4 w-4" />
                    Rejeitar
                  </button>
                  <button
                    onClick={() => product._id && handleStatusUpdate(product._id, "aprovado")}
                    disabled={isProcessing}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-success py-2.5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-green-700 ${
                      isProcessing ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <CheckIcon className="h-4 w-4" />
                    Aprovar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};