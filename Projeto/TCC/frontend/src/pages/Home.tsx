import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct, type Product } from "../services/productService";

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Não foi possível carregar os produtos. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza de que deseja excluir este produto?")) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Erro ao tentar remover o produto.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Carregando produtos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center shadow-sm">
        <p className="font-semibold">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catálogo de Produtos</h1>
          <p className="text-gray-500 text-sm mt-1">
            Exibindo {products.length} {products.length === 1 ? "item cadastrado" : "itens cadastrados"}
          </p>
        </div>
        <Link
          to="/cadastrar-produto"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          + Cadastrar Produto
        </Link>
      </div>

      {/* Lista Vazia */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg mx-auto">
          <p className="text-gray-600 font-medium mb-4">Nenhum produto cadastrado até o momento.</p>
          <Link
            to="/cadastrar-produto"
            className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4"
          >
            Adicionar o primeiro produto
          </Link>
        </div>
      ) : (
        /* Grid de Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Imagem do Produto */}
                <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>

                {/* Detalhes */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 truncate" title={product.title}>
                    {product.title}
                  </h3>
                  {product.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                  )}
                  <p className="text-2xl font-black text-emerald-600 mt-4">
                    R$ {Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => product._id && handleDelete(product._id)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-sm font-semibold py-2 rounded-lg transition-colors border border-red-200"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};