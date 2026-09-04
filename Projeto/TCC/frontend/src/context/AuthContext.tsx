import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateCurrentUser,
  type RegisterData,
} from "../services/userService";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "comerciante" | "cliente";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (id: string, data: Partial<Pick<User, "name" | "email" | "avatar">>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "user";

const readStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(readStoredUser);

  useEffect(() => {
    const handleStorage = () => setUser(readStoredUser());
    const handleAuthChange = () => setUser(readStoredUser());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginUser({ email, password });
    const userData: User = data.user || data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await registerUser(data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.warn("Erro ao encerrar sessão no backend, limpando estado local:", error);
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  const updateProfile = useCallback(
    async (id: string, data: Partial<Pick<User, "name" | "email" | "avatar">>) => {
      const result = await updateCurrentUser(id, data);
      const userData: User = result.user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      window.dispatchEvent(new Event("auth-change"));
    },
    []
  );

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
