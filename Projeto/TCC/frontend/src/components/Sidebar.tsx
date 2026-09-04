import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CartIcon,
  MailIcon,
  PackageIcon,
  PlusIcon,
  ShieldCheckIcon,
  StoreIcon,
  UsersIcon,
  XIcon,
  ZapIcon,
} from "./Icons";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
  show?: boolean;
}

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-muted hover:bg-brand-50/60 hover:text-brand-700"
  }`;

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="px-3 pb-1.5 pt-5 text-[11px] font-bold uppercase tracking-wider text-muted/70">
    {children}
  </p>
);

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Fecha o drawer automaticamente ao navegar
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isLogged = Boolean(user);
  const isStore = user?.role === "comerciante" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const navigationLinks: SidebarLink[] = [
    { to: "/", label: "Início", icon: <StoreIcon />, show: true },
    { to: "/carrinho", label: "Carrinho", icon: <CartIcon />, show: true },
    { to: "/meus-pedidos", label: "Meus Pedidos", icon: <PackageIcon />, show: isLogged },
    { to: "/perfil", label: "Meu Perfil", icon: <UsersIcon />, show: isLogged },
  ];

  const storeLinks: SidebarLink[] = [
    { to: "/painel", label: "Dashboard", icon: <ZapIcon />, show: isStore },
    { to: "/meus-produtos", label: "Minha Loja", icon: <StoreIcon />, show: isStore },
    { to: "/minhas-vendas", label: "Minhas Vendas", icon: <PackageIcon />, show: isStore },
    { to: "/cadastrar-produto", label: "Novo Produto", icon: <PlusIcon />, show: isStore },
  ];

  const adminLinks: SidebarLink[] = [
    { to: "/admin/dashboard", label: "Resumo do site", icon: <ZapIcon />, show: isAdmin },
    { to: "/admin/pendentes", label: "Painel Admin", icon: <ShieldCheckIcon />, show: isAdmin },
    { to: "/admin/pedidos", label: "Pedidos", icon: <PackageIcon />, show: isAdmin },
  ];

  const authLinks: SidebarLink[] = [
    { to: "/login", label: "Entrar", icon: <StoreIcon />, show: !user },
    { to: "/registro", label: "Cadastrar", icon: <PlusIcon />, show: !user },
  ];

  const helpLinks: SidebarLink[] = [
    { to: "/suporte", label: "Suporte", icon: <MailIcon />, show: true },
    { to: "/admin/suporte", label: "Mensagens de suporte", icon: <MailIcon />, show: isAdmin },
  ];

  const renderLinks = (links: SidebarLink[]) =>
    links
      .filter((link) => link.show)
      .map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          onClick={onClose}
          className={linkClass}
        >
          <span className="[&>svg]:h-5 [&>svg]:w-5">{link.icon}</span>
          {link.label}
        </NavLink>
      ));

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className={`fixed inset-0 z-30 bg-ink/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer (mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 top-16 z-40 w-64 transform overflow-y-auto border-r border-line bg-white transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu de navegação"
      >
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="text-base font-extrabold tracking-tight text-ink">
            Maxibuy
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
            aria-label="Fechar menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 pb-8">
          <SectionTitle>Navegação</SectionTitle>
          {renderLinks(navigationLinks)}

          {isStore && (
            <>
              <SectionTitle>Sua loja</SectionTitle>
              {renderLinks(storeLinks)}
            </>
          )}

          {isAdmin && (
            <>
              <SectionTitle>Administração</SectionTitle>
              {renderLinks(adminLinks)}
            </>
          )}

          {renderLinks(helpLinks).length > 0 && (
            <>
              <SectionTitle>Ajuda</SectionTitle>
              {renderLinks(helpLinks)}
            </>
          )}

          {!user && (
            <>
              <SectionTitle>Conta</SectionTitle>
              {renderLinks(authLinks)}
            </>
          )}
        </nav>
      </aside>

      {/* Sidebar (desktop) */}
      <aside
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 items-start border-r border-line bg-white lg:flex"
        aria-label="Menu de navegação"
      >
        <nav className="w-full px-3 py-6">
          <SectionTitle>Navegação</SectionTitle>
          {renderLinks(navigationLinks)}

          {isStore && (
            <>
              <SectionTitle>Sua loja</SectionTitle>
              {renderLinks(storeLinks)}
            </>
          )}

          {isAdmin && (
            <>
              <SectionTitle>Administração</SectionTitle>
              {renderLinks(adminLinks)}
            </>
          )}

          {renderLinks(helpLinks).length > 0 && (
            <>
              <SectionTitle>Ajuda</SectionTitle>
              {renderLinks(helpLinks)}
            </>
          )}

          {!user && (
            <>
              <SectionTitle>Conta</SectionTitle>
              {renderLinks(authLinks)}
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;