import { useState } from 'react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  // Exemplo de produtos fictícios
  const products = [
 
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans ">
      
      {/* 1. NAV BAR (Inspirada na Amazon) */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo da Marca */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              TechStore
            </span>
          </div>

          {/* Barra de Busca Central */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos, marcas e muito mais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 border border-slate-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
             
            </div>
          </div>

          {/* Ações / Carrinho */}
          <div className="flex items-center gap-6">
            <a href="#" className="hidden sm:block text-sm hover:text-blue-400 transition">
              Entrar
            </a>
            <button className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700">
              
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Sub-menu de Categorias */}
        <nav className="bg-slate-850 border-t border-slate-800 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm text-slate-400 overflow-x-auto whitespace-nowrap">
            <a href="#" className="hover:text-blue-400 font-medium">Todas as Categorias</a>
            <a href="#" className="hover:text-blue-400">Promoções</a>
            <a href="#" className="hover:text-blue-400">Hardware</a>
            <a href="#" className="hover:text-blue-400">Periféricos</a>
            <a href="#" className="hover:text-blue-400">Celulares</a>
          </div>
        </nav>
      </header>

      {/* 2. HERO BANNER */}
      <section className="bg-gradient-to-r from-blue-900 to-slate-900 border-b border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
              Ofertas Especiais
            </span>
            
            
          </div>
        </div>
      </section>

      {/* 3. GRID DE PRODUTOS */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-2">
          Destaques para você
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col group"
            >
              {/* Imagem do Produto */}
              <div className="h-48 overflow-hidden bg-slate-800 relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Informações do Produto */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-blue-400 uppercase font-bold tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-1 text-slate-200 group-hover:text-white transition">
                    {product.title}
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Preço</span>
                    <span className="text-xl font-bold text-white">{product.price}</span>
                  </div>
                  <button className="bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition border border-slate-700 hover:border-transparent">
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. RODAPÉ (FOOTER) */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-slate-400 text-sm   ">
        <p>© 2026 TechStore - Projeto TCC. Todos os direitos reservados.</p>
      </footer>

    </div>
  )
}