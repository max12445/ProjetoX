import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "../components/Icons";

export const Register: React.FC = () => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const navigateTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navigateTimeoutRef.current !== null) {
        window.clearTimeout(navigateTimeoutRef.current);
      }
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await register({ name, email, password });

      setMessage({
        text: "Usuário cadastrado com sucesso! Faça login para continuar.",
        type: "success",
      });

      navigateTimeoutRef.current = window.setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError
          ? error.response?.data?.message
          : undefined;
      setError(errorMsg || "Não foi possível criar sua conta. Tente de novo.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-line bg-surface py-2.5 pr-4 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-lift">
        <h2 className="text-center text-2xl font-bold text-ink">Criar conta</h2>

        <p className="mb-6 mt-2 text-center text-sm text-muted">
          Crie sua conta para navegar e comprar produtos na plataforma.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-danger-soft p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div
            className={`mb-4 rounded-xl border p-3 text-sm font-medium ${
              message.type === "success"
                ? "border-green-200 bg-success-soft text-green-700"
                : "border-red-200 bg-danger-soft text-red-700"
            }`}
            role="status"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Nome completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              placeholder="Ex: Maria Silva"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">E-mail</label>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${fieldClass} pl-10`}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Senha</label>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${fieldClass} pl-10 pr-12`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-brand-600"
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Já possui conta?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};