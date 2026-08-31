import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import type { Product } from "../types/product";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Produto não encontrado.");
      setLoading(false);
      return;
    }

    getProductById(id)
      .then((data) => {
        setProduct(data);
        setError(null);
      })
      .catch(() => setError("Não foi possível carregar o produto."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 font-medium">Carregando produto...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-6">{error || "Produto não encontrado."}</p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline text-sm font-medium mb-6 inline-block">
        ← Voltar para a loja
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-72 md:h-full object-cover"
          />
        </div>

        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              {product.title}
            </h1>

            {product.description && (
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-2xl font-extrabold text-gray-900">
              R$ {Number(product.price || 0).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
