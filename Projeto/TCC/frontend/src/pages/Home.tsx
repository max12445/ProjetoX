import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories, getStores } from "../services/productService";
import { useProductContext } from "../context/ProductContext";
import type { Product } from "../types/product";
import type { ProductFilters, Store } from "../services/productService";
import { ProductCard } from "../components/ProductCard";
import { SearchIcon, StoreIcon, TruckIcon } from "../components/Icons";

type SortOption = "recent" | "priceAsc" | "priceDesc";

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedStore, setSelectedStore] = useState("todas");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { refreshKey } = useProductContext();
  const PAGE_SIZE = 12;

  // Debounce da busca: aplica a palavra após 300ms sem digitação
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Categorias disponíveis para filtro (vindas do servidor)
  useEffect(() => {
    let active = true;
    getCategories()
      .then((result) => {
        if (active) setCategories(result);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Lojas com produtos aprovados (para o filtro de loja)
  useEffect(() => {
    let active = true;
    getStores()
      .then((result) => {
        if (active) setStores(result);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const filters = useMemo<ProductFilters>(
    () => ({
      q: search || undefined,
      category: selectedCategory === "todos" ? undefined : selectedCategory,
      store: selectedStore === "todas" ? undefined : selectedStore,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sort,
    }),
    [search, selectedCategory, selectedStore, minPrice, maxPrice, sort]
  );

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(1, PAGE_SIZE, filters);
        if (!active) return;
        setProducts(data.products ?? data.data ?? []);
        setPage(1);
        setTotal(data.pagination?.total ?? 0);
        setHasMore((data.pagination?.totalPages ?? 1) > 1);
      } catch (error) {
        console.error("Falha ao carregar produtos:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [filters, refreshKey]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    try {
      setLoadingMore(true);
      const data = await getProducts(nextPage, PAGE_SIZE, filters);
      const newProducts = data.products ?? data.data ?? [];
      setProducts((prev) => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore((data.pagination?.total ?? total) > nextPage * PAGE_SIZE);
    } catch (error) {
      console.error("Falha ao carregar mais produtos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const hasFilters =
    search !== "" ||
    selectedCategory !== "todos" ||
    selectedStore !== "todas" ||
    minPrice !== "" ||
    maxPrice !== "";

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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="O que você está procurando hoje?"
              className="w-full rounded-xl border border-line bg-surface py-3 pl-11 pr-4 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-1 flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange("todos")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === "todos"
                    ? "bg-brand-600 text-white shadow-lift"
                    : "bg-surface text-muted hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-brand-600 text-white shadow-lift"
                      : "bg-surface text-muted hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-sm">
                <span className="text-xs font-medium text-muted">Loja</span>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  aria-label="Filtrar por loja"
                  className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                >
                  <option value="todas">Todas</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.productCount})
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-1.5 text-sm">
                <span className="text-xs font-medium text-muted">Preço</span>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  aria-label="Preço mínimo"
                  className="w-20 rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                />
                <span className="text-muted">–</span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  aria-label="Preço máximo"
                  className="w-20 rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                />
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="Ordenar produtos"
                className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="recent">Mais recentes</option>
                <option value="priceAsc">Menor preço</option>
                <option value="priceDesc">Maior preço</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de produtos */}
        {hasFilters && !loading && (
          <p className="text-sm text-muted">
            {total} {total === 1 ? "produto encontrado" : "produtos encontrados"} para
            a busca selecionada.
          </p>
        )}

        <div>
          <h2 className="mb-6 text-xl font-bold text-ink">Produtos em Destaque</h2>

          {loading ? (
            <div className="rounded-2xl border border-line bg-white py-12 text-center">
              <p className="text-sm text-muted">Buscando produtos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white py-12 text-center">
              <StoreIcon className="mx-auto mb-3 h-8 w-8 text-muted" />
              <p className="text-sm text-muted">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
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

export default Home;