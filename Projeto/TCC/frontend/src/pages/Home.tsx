import { useState, useEffect } from 'react'
import { api } from '../services/api'

// Define a estrutura do produto recebida do backend
interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Executa uma vez ao carregar a página
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get('/produto');
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Produtos em Destaque</h1>

      {loading ? (
        <p className="text-slate-400">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400">Nenhum produto cadastrado no momento.</p>
      ) : (
        /* Grid para exibir os produtos organizados */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-48 object-cover bg-slate-800"
                />
                <div className="p-4">
                  <span className="text-xs font-bold text-blue-400 uppercase">
                    {product.category}
                  </span>
                  <h2 className="text-lg font-semibold mt-1">{product.title}</h2>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xl font-bold text-white">
                  R$ {Number(product.price).toFixed(2)}
                </span>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}