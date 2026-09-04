import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import { useProductContext } from "../context/ProductContext";
import type { Product } from "../types/product";
import { ProductCard } from "../components/ProductCard";
import { SearchIcon, StoreIcon, TruckIcon } from "../components/Icons";

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { refreshKey } = useProductContext();
  const PAGE_SIZE = 12;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(1, PAGE_SIZE);
        setProducts(data.products ?? data.data ?? []);
        setPage(1);
        setHasMore((data.pagination?.totalPages ?? 1) > 1);
      } catch (error) {
        console.error("Falha ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [refreshKey]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    try {
      setLoadingMore(true);
      const data = await getProducts(nextPage, PAGE_SIZE);
      const newProducts = data.products ?? data.data ?? [];
      setProducts((prev) => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore((data.pagination?.totalPages ?? 1) > nextPage);
    } catch (error) {
      console.error("Falha ao carregar mais produtos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const categories = useMemo(
    () => [
      "todos",
      ...Array.from(new Set(products.map((product) => product.category))),
    ],
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          selectedCategory === "todos" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [products, search, selectedCategory]
  );

  return (
    <div className="min-h-screen">
      {/* Hero minimalista */}
      <section className="bg-gradient-to-br from-surface via-white to-brand-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 uppercase tracking-wider">
            <TruckIcon className="h-4 w-4" />
            Entrega rápida para todo o Brasil
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-ink md:text-6xl">
            Encontre as melhores ofertas da cidade
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted md:text-lg">
            Descubra produtos incríveis de comerciantes locais com entrega
            rápida e garantia.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#produtos"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700"
            >
              Explorar produtos
            </a>
            <Link
              to="/carrinho"
              className="rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
            >
              Ver carrinho
            </Link>
          </div>
        </div>
      </section>

      <main id="produtos" className="mx-auto max-w-6xl px-4 py-8 space-y-8 sm:px-6">
        {/* Filtros */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-lift space-y-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted">
              <SearchIcon className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="O que você está procurando hoje?"
              className="w-full rounded-xl border border-line bg-surface py-3 pl-11 pr-4 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-brand-600 text-white shadow-lift"
                    : "bg-surface text-muted hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {cat === "todos" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de produtos */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-ink">Produtos em Destaque</h2>

          {loading ? (
            <div className="rounded-2xl border border-line bg-white py-12 text-center">
              <p className="text-sm text-muted">Buscando produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white py-12 text-center">
              <StoreIcon className="mx-auto mb-3 h-8 w-8 text-muted" />
              <p className="text-sm text-muted">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lift transition-colors hover:border-brand-200 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingMore ? "Carregando..." : "Carregar mais produtos"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};