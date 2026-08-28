import React, { useEffect, useState } from "react";
import {
  getPendingProducts,
  updateProductStatus,
  type Product,
} from "../services/productService";
import { useProductContext } from "../context/ProductContext";

export const AdminDashboard: React.FC = () => {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { triggerRefresh } = useProductContext();

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingProducts();
      setPendingProducts(data);
    } catch (err: any) {
      setError("Não foi possível carregar a lista de produtos pendentes.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: "aprovado" | "rejeitado") => {
    try {
      setActionLoadingId(id);
      await updateProductStatus(id, status);
      // Remove o produto da lista local após a ação
      setPendingProducts((prev) => prev.filter((product) => product._id !== id));
      
      // ✅ ATUALIZAR: Se foi aprovado, dispara refresh dos produtos
      if (status === "aprovado") {
        triggerRefresh();
      }
    } catch (err: any) {
      alert(`Erro ao tentar ${status === "aprovado" ? "aprovar" : "rejeitar"} o produto.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Carregando painel do administrador...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Painel do Admin
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-2">
          Aprovação de Produtos
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Analise e gerencie os produtos submetidos pelos comerciantes antes de exibi-los na loja.
        </p>
      </div>

      {/* Card de Estatísticas Rápida */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pendente de Análise</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendingProducts.length}</p>
          </div>
          <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold">
            ⏳
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Conteúdo Principal */}
      {pendingProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            ✓
          </div>
          <h3 className="text-lg font-bold text-gray-900">Tudo limpo por aqui!</h3>
          <p className="text-gray-500 text-sm mt-1">
            Não há produtos pendentes de aprovação no momento.
          </p>
        </div>
      ) : (
        /* Lista em Cards Responsivos */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingProducts.map((product) => {
            const isProcessing = actionLoadingId === product._id;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Imagem + Badge de Status */}
                  <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide">
                      Pendente
                    </span>
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  {/* Detalhes do Produto */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 truncate" title={product.title}>
                      {product.title}
                    </h3>

                    {product.description && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">Preço sugerido</span>
                      <span className="text-xl font-extrabold text-emerald-600">
                        R$ {Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => product._id && handleStatusUpdate(product._id, "rejeitado")}
                    disabled={isProcessing}
                    className={`py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 ${
                      isProcessing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Rejeitar
                  </button>

                  <button
                    onClick={() => product._id && handleStatusUpdate(product._id, "aprovado")}
                    disabled={isProcessing}
                    className={`py-2.5 px-4 rounded-xl font-semibold text-sm text-white shadow-sm transition-colors bg-emerald-600 hover:bg-emerald-700 ${
                      isProcessing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
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