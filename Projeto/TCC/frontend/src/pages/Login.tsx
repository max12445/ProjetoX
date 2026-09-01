import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { MailIcon, LockIcon } from "../components/Icons";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !senha) {
      setMessage({ text: "Preencha todos os campos.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      await login(email, senha);

      setMessage({ text: "Login realizado com sucesso! Entrando...", type: "success" });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError
          ? error.response?.data?.message
          : undefined;
      setMessage({
        text: errorMsg || "Não conseguimos encontrar essa combinação. Verifique e tente de novo.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-12 max-w-md px-4">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-lift sm:p-8">
        <h2 className="text-center text-2xl font-bold text-ink">Entrar na conta</h2>
        <p className="mb-6 mt-2 text-center text-sm text-muted">
          Acesse sua conta para gerenciar e comprar produtos.
        </p>

        {message && (
          <div
            className={`mb-6 rounded-xl border p-4 text-sm font-medium ${
              message.type === "success"
                ? "border-green-200 bg-success-soft text-green-700"
                : "border-red-200 bg-danger-soft text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">E-mail</label>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Senha</label>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700 ${
              loading ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Ainda não tem uma conta?{" "}
          <Link to="/registro" className="font-semibold text-brand-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};