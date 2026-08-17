import React, { useState } from "react";

// Tipagem de exemplo para os produtos
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export const Home: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Categorias disponíveis para filtro
  const categories = ["Todos", "Eletrônicos", "Roupas", "Acessórios", "Alimentos"];

  // Dados fictícios para demonstração
  const products: Product[] = [
    { id: "1", name: "Fone de Ouvido Sem Fio", category: "Eletrônicos", price: 199.9, image: "https://via.placeholder.com/300" },
    { id: "2", name: "Camiseta Algodão Premium", category: "Roupas", price: 79.9, image: "https://via.placeholder.com/300" },
    { id: "3", name: "Relógio Inteligente Smart", category: "Acessórios", price: 349.0, image: "https://via.placeholder.com/300" },
    { id: "4", name: "Café Especial 500g", category: "Alimentos", price: 45.0, image: "https://via.placeholder.com/300" },
  ];

  // Lógica de filtragem por busca e categoria
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Encontre as melhores ofertas da cidade
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Descubra produtos incríveis de comerciantes locais com entrega rápida e garantia.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* 2. BARRA DE PESQUISA & FILTROS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          {/* Campo de Busca */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="O que você está procurando hoje?"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          {/* Filtros por Categoria (Pills) */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. GRID DE PRODUTOS */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Produtos em Destaque</h2>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 text-sm">Nenhum produto encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};