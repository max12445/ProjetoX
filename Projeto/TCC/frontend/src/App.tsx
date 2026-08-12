import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-6 p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-sm">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-2">
          Tailwind CSS v4 🚀
        </h1>
        <p className="text-slate-400 mb-6 text-sm">
          Se você está vendo este card escuro e estilizado, a instalação foi um sucesso!
        </p>

        <button 
          onClick={() => setCount((c) => c + 1)}
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-blue-500/20"
        >
          Cliques: {count}
        </button>
      </div>
    </div>
  )
}