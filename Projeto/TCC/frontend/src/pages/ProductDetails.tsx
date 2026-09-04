import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getProductById,
  getRecommendedProducts,
  getProductStore,
  type StoreProfile,
} from "../services/productService";
import { getProductImages, type Product } from "../types/product";
import { useCart } from "../context/CartContext";
import { PriceTag } from "../components/PriceTag";
import { ProductCard } from "../components/ProductCard";
import { StoreCard } from "../components/StoreCard";
import {
  ChevronLeftIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
} from "../components/Icons";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const images = product ? getProductImages(product) : [];
  const outOfStock = typeof product?.stock === "number" && product.stock <= 0;

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Produto não encontrado.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      const [productData, recommendedData, storeData] = await Promise.all([
        getProductById(id),
        getRecommendedProducts(id).catch(() => []),
        getProductStore(id).catch(() => ({ store: null, products: [] })),
      ]);
      return { productData, recommendedData, storeData };
    };

    loadData()
      .then(({ productData, recommendedData, storeData }) => {
        setProduct(productData);
        setRecommended(recommendedData);
        setStore(storeData.store);
        setStoreProducts(storeData.products);
        setQuantity(1);
        setActiveImage(0);
        setAdded(false);
        setError(null);
      })
      .catch(() => setError("Não foi possível carregar o produto."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || outOfStock) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || outOfStock) return;
    addItem(product, quantity);
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm font-medium text-muted">Buscando produto...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="mb-6 text-muted">{error || "Produto não encontrado."}</p>
        <Link
          to="/"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Voltar para a loja
      </Link>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lift md:flex-row">
        {/* Galeria */}
        <div className="bg-surface p-4 md:w-1/2">
          <div className="h-72 overflow-hidden rounded-xl border border-line bg-white md:h-80">
            <img
              src={images[activeImage] ?? ""}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === idx
                      ? "border-brand-600"
                      : "border-transparent hover:border-line"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between p-6 sm:p-8 md:w-1/2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              {product.category}
            </span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {product.title}
            </h1>

            {product.description && (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {product.description}
              </p>
            )}

            <div className="mt-6 border-t border-line pt-6">
              <PriceTag value={product.price} size="xl" contrast="success" />
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                  <TruckIcon className="h-4 w-4" />
                  Entrega rápida para todo o Brasil
                </p>
                {typeof product.stock === "number" && (
                  outOfStock ? (
                    <p className="text-xs font-semibold text-danger">Esgotado</p>
                  ) : (
                    <p className="text-xs font-medium text-muted">
                      {product.stock} em estoque
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-ink">Quantidade:</label>
              <div className="flex items-center rounded-xl border border-line">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-l-xl px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-ink"
                  aria-label="Diminuir quantidade"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="min-w-[48px] border-x border-line px-4 py-2 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(
                        typeof product.stock === "number" ? product.stock : 999,
                        q + 1
                      )
                    )
                  }
                  disabled={quantity >= (typeof product.stock === "number" ? product.stock : 999)}
                  className="rounded-r-xl px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Aumentar quantidade"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold shadow-lift transition-colors ${
                  outOfStock
                    ? "cursor-not-allowed bg-line text-muted"
                    : added
                      ? "bg-success text-white"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                {outOfStock ? "Indisponível" : added ? "Adicionado!" : "Adicionar ao carrinho"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${
                  outOfStock
                    ? "cursor-not-allowed bg-line text-muted"
                    : "bg-ink text-white hover:bg-slate-800"
                }`}
              >
                {outOfStock ? "Esgotado" : "Comprar agora"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      {recommended.length > 0 && (
        <section className="mt-12" aria-label="Produtos recomendados">
          <h2 className="text-xl font-bold text-ink">Você também pode gostar</h2>
          <p className="mb-6 mt-1 text-sm text-muted">
            Outros itens parecidos com o que você está vendo.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* Loja */}
      {store && storeProducts.length > 0 && (
        <section className="mt-12" aria-label="Loja">
          <h2 className="mb-4 text-xl font-bold text-ink">Conheça a loja</h2>
          <StoreCard store={store} productCount={storeProducts.length} />
          <h3 className="mb-6 mt-6 text-lg font-bold text-ink">
            Outros produtos desta loja
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {storeProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;