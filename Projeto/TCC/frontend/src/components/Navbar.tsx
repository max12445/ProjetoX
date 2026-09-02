import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CartIcon, LogoutIcon, PackageIcon, StoreIcon } from "./Icons";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/75 shadow-lift backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink transition-colors hover:text-brand-600"
        >
          <StoreIcon className="h-6 w-6 text-brand-600" />
          TechStore
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            Produtos
          </Link>

          {(user?.role === "comerciante" || user?.role === "admin") && (
            <Link
              to="/cadastrar-produto"
              className="hidden rounded-lg px-3 py-2 text-ink transition-colors hover:bg-brand-50 hover:text-brand-700 sm:block"
            >
              Novo Produto
            </Link>
          )}

          {(user?.role === "comerciante" || user?.role === "admin") && (
            <Link
              to="/meus-produtos"
              className="hidden rounded-lg px-3 py-2 text-ink transition-colors hover:bg-brand-50 hover:text-brand-700 sm:block"
            >
              Minha Loja
            </Link>
          )}

          {(user?.role === "comerciante" || user?.role === "admin") && (
            <Link
              to="/minhas-vendas"
              className="hidden rounded-lg px-3 py-2 text-ink transition-colors hover:bg-brand-50 hover:text-brand-700 sm:block"
            >
              Minhas Vendas
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/pendentes"
              className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700 transition-colors hover:bg-amber-100"
            >
              Painel Admin
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/pedidos"
              className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700 transition-colors hover:bg-amber-100"
            >
              Pedidos
            </Link>
          )}

          <Link
            to="/carrinho"
            className="relative rounded-lg p-2 text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
            title="Carrinho"
          >
            <CartIcon className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-success px-1 text-[10px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="ml-1 flex items-center gap-1 border-l border-line pl-2 sm:gap-2 sm:pl-3">
              <span className="hidden max-w-[140px] truncate text-slate-600 lg:block">
                Olá, {user.name || "Usuário"}
              </span>
              <Link
                to="/meus-pedidos"
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
                title="Meus Pedidos"
              >
                <PackageIcon className="h-5 w-5 lg:hidden" />
                <span className="hidden lg:inline">Meus Pedidos</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-ink transition-colors hover:bg-danger-soft hover:text-danger"
                title="Sair"
              >
                <LogoutIcon className="h-5 w-5" />
                <span className="hidden lg:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="ml-1 flex items-center gap-2 border-l border-line pl-2 sm:pl-3">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                Entrar
              </Link>
              <Link
                to="/registro"
                className="rounded-lg bg-brand-600 px-4 py-2 text-white shadow-lift transition-colors hover:bg-brand-700"
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