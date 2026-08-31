import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "comerciante" | "cliente";
}

const readUser = () => {
  try {
    const userStored = localStorage.getItem("user");
    return userStored ? JSON.parse(userStored) : null;
  } catch {
    return null;
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const user = readUser();

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se houver restrição de role e o usuário não tiver a permissão, redireciona para a home
  if (role && user.role !== role && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
