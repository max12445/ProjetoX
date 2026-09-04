import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { getMyProducts, updateProductStock, deleteProduct } from "../services/productService";
import { getProductImage, type Product } from "../types/product";
import { useProductContext } from "../context/ProductContext";
import { BadgeStatus } from "../components/BadgeStatus";
import { EmptyState } from "../components/EmptyState";
import { PriceTag } from "../components/PriceTag";
import { CheckIcon, EditIcon, PlusIcon, StoreIcon, TrashIcon } from "../components/Icons";

export const MyProducts: React.FC = () => {
  const { triggerRefresh } = useProductContext();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stockEdits, setStockEdits] = useState<Record<string, number | "">>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    let active = true;

    getMyProducts()
      .then((data) => {
        if (!active) return;
        setProducts(data);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("Não foi possível carregar seus produtos.");
      });

    return () => {
      active = false;
    };
  }, []);

  const handleStockChange = (id: string, value: string) => {
    setStockEdits((prev) => ({
      ...prev,
      [id]: value === "" ? "" : Number(value),
    }));
  };

  const handleSaveStock = async (product: Product) => {
    const raw = stockEdits[product._id];
    const stock = typeof raw === "number" && raw >= 0 ? raw : product.stock ?? 0;
    setSavingId(product._id);
    setMessage(null);

    try {
      await updateProductStock(product._id, stock);
      setProducts((prev) =>
        prev
          ? prev.map((p) => (p._id === product._id ? { ...p, stock } : p))
          : prev
      );
      setStockEdits((prev) => {
        const next = { ...prev };
        delete next[product._id];
        return next;
      });
      triggerRefresh();
      setMessage({ text: "Estoque atualizado com sucesso!", type: "success" });
    } catch (err) {
      const errorMsg =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setMessage({ text: errorMsg || "Erro ao atualizar o estoque.", type: "error" });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Excluir "${product.title}"? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    setDeletingId(product._id);
    setMessage(null);

    try {
      await deleteProduct(product._id);
      setProducts((prev) => (prev ? prev.filter((p) => p._id !== product._id) : prev));
      triggerRefresh();
      setMessage({ text: "Produto excluído com sucesso!", type: "success" });
    } catch (err) {
      const errorMsg =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setMessage({ text: errorMsg || "Erro ao excluir o produto.", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  if (products === null && !error) {
    return (
      <div className="mx-auto flex h-64 max-w-5xl items-center justify-center">
        <span className="text-sm font-medium text-muted">Carregando seus produtos...</span>
      </div>
    );
  }

  if (error && products === null) {
    return (
      <EmptyState
        icon={<StoreIcon />}
        title="Não conseguimos carregar seus produtos"
        description={error}
      />
    );
  }

  if (products && products.length === 0) {
    return (
      <div className="mx-auto px-4 py-10 sm:px-6">
        <div className="mx-auto mb-8 max-w-5xl">
          <h1 className="text-2xl font-bold text-ink">Minha Loja</h1>
          <p className="mt-1 text-sm text-muted">
            Gerencie o estoque e os produtos da sua loja.
          </p>
        </div>
        <EmptyState
          icon={<StoreIcon />}
          title="Você ainda não cadastrou produtos"
          description="Cadastre seu primeiro produto para começar a vender na Maxibuy."
        >
          <Link
            to="/cadastrar-produto"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700"
          >
            <PlusIcon className="h-4 w-4" />
            Cadastrar produto
          </Link>
        </EmptyState>
      </div>
    );
  }

  const hasEdits = Object.keys(stockEdits).length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Minha Loja</h1>
          <p className="mt-1 text-sm text-muted">
            Gerencie a quantidade em estoque e exclua produtos.
          </p>
        </div>
        <Link
          to="/cadastrar-produto"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700"
        >
          <PlusIcon className="h-4 w-4" />
          Novo produto
        </Link>
      </div>

      {message && (
        <div
          className={`mt-4 rounded-xl border p-4 text-sm font-medium ${
            message.type === "success"
              ? "border-green-200 bg-success-soft text-green-700"
              : "border-red-200 bg-danger-soft text-red-700"
          }`}
          role="status"
        >
          {message.text}
        </div>
      )}

      {hasEdits && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-warn-soft p-4 text-sm text-amber-700">
          Há alterações de estoque não salvas. Clique em "Salvar" em cada linha para aplicar.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {products?.map((product) => {
          const isSaving = savingId === product._id;
          const isDeleting = deletingId === product._id;
          const editValue =
            stockEdits[product._id] !== undefined
              ? stockEdits[product._id]
              : product.stock ?? 0;
          const stock = typeof product.stock === "number" ? product.stock : null;
          const hasSingleStatus =
            product.status === "pendente" || product.status === "rejeitado";

          return (
            <div
              key={product._id}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-lift sm:flex-row sm:items-center"
            >
              <Link
                to={`/produto/${product._id}`}
                className="shrink-0 overflow-hidden rounded-xl border border-line"
                title={product.title}
              >
                <img
                  src={getProductImage(product)}
                  alt={product.title}
                  className="h-20 w-20 object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/produto/${product._id}`}
                    className="truncate font-semibold text-ink transition-colors hover:text-brand-700"
                  >
                    {product.title}
                  </Link>
                  {product.status && <BadgeStatus status={product.status} />}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{product.category}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <PriceTag value={product.price} size="md" />
                  {stock === null ? (
                    <span className="text-xs font-medium text-muted">
                      Sem controle de estoque
                    </span>
                  ) : stock <= 0 ? (
                    <span className="text-xs font-semibold text-danger">Esgotado</span>
                  ) : (
                    <span className="text-xs font-medium text-muted">
                      {stock} {stock === 1 ? "unidade" : "unidades"} em estoque
                    </span>
                  )}
                  {hasSingleStatus && (
                    <span className="text-xs text-muted">
                      Visível após aprovação
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="flex items-center rounded-xl border border-line bg-surface">
                  <span className="pl-3 text-xs font-semibold text-muted">
                    Estoque
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={editValue}
                    onChange={(e) => handleStockChange(product._id, e.target.value)}
                    className="w-20 bg-transparent px-3 py-2 text-sm font-semibold text-ink outline-none"
                    aria-label={`Estoque de ${product.title}`}
                  />
                </div>
                <Link
                  to={`/editar-produto/${product._id}`}
                  className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
                  aria-label={`Editar ${product.title}`}
                >
                  <EditIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Editar</span>
                </Link>
                <button
                  onClick={() => handleSaveStock(product)}
                  disabled={isSaving || isDeleting || Number(editValue) === (product.stock ?? 0)}
                  className="flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isSaving ? "Salvando..." : "Salvar"}
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  disabled={isSaving || isDeleting}
                  className="flex items-center gap-1.5 rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  title="Excluir produto"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyProducts;