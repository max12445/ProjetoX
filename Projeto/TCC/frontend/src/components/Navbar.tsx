import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/userService";

const readUser = () => {
  try {
    const userStored = localStorage.getItem("user");
    return userStored ? JSON.parse(userStored) : null;
  } catch {
    return null;
  }
};

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(readUser);

  useEffect(() => {
    // Atualiza a Navbar quando o usuário loga/desloga em outras abas ou rotas
    const handleStorage = () => setUser(readUser());
    const handleAuthChange = () => setUser(readUser());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignora erro de logout; continua limpando o estado local
    }
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-tight text-blue-400 hover:text-blue-300 transition-colors">
          TechStore
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Produtos
          </Link>

          {/* Visível para Comerciante e Admin */}
          {(user?.role === "comerciante" || user?.role === "admin") && (
            <Link to="/cadastrar-produto" className="hover:text-blue-400 transition-colors">
              + Novo Produto
            </Link>
          )}

          {/* Visível EXCLUSIVAMENTE para Admin */}
          {user?.role === "admin" && (
            <Link
              to="/admin/pendentes"
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
            >
              Painel Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4 border-l border-slate-700 pl-4">
              <span className="text-slate-300 font-semibold">
                Olá, {user.name || user.nome || "Usuário"} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg text-xs transition-colors border border-red-500/30"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
              <Link to="/login" className="hover:text-blue-400 transition-colors">
                Entrar
              </Link>
              <Link
                to="/registro"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};