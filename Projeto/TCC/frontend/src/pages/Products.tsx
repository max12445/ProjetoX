import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { useProductContext } from "../context/ProductContext";
import type { Product } from "../types/product";

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");
  const { refreshKey } = useProductContext();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("Não foi possível carregar os produtos.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [refreshKey]); // ✅ Re-fetch quando refreshKey muda

  // Cria as categorias automaticamente
  const categories = [
    "todos",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  // Filtra os produtos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "todos" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">Produtos</h1>
          <p className="text-blue-100">
            Encontre os melhores produtos disponíveis na TechStore.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Pesquisa e filtros */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔎 O que você está procurando?"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />

          <div className="flex flex-wrap gap-3 mt-4">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item === "todos"
                  ? "Todos"
                  : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Carregando */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            Carregando produtos...
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="text-center py-10 text-red-600">
            {error}
          </div>
        )}

        {/* Nenhum produto */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">
              Nenhum produto encontrado.
            </p>
          </div>
        )}

        {/* Produtos */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Todos os produtos
              </h2>
              <span className="text-sm text-gray-500">
                {filteredProducts.length} produto(s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  {/* Imagem */}
                  <div className="h-52 bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Informações */}
                  <div className="p-4">
                    <span className="text-xs font-semibold text-blue-600 uppercase">
                      {product.category}
                    </span>

                    <h3 className="font-semibold text-gray-900 mt-2">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mt-5">
                      <span className="text-lg font-bold text-gray-900">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>

                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};