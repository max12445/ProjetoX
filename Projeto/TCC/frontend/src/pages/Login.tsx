import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // 1. Evita o recarregamento da página e reseta a mensagem
    e.preventDefault();
    setMessage(null);

    // 2. Validação inicial
    if (!email || !senha) {
      setMessage({ text: "Preencha todos os campos.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email, senha });

      // 3. Salva o Token isolado no localStorage (crucial para o authMiddleware)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 4. Salva os dados do usuário
      localStorage.setItem("user", JSON.stringify(data.user || data));

      setMessage({ text: "Login realizado com sucesso! Entrando...", type: "success" });

      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Recarrega para atualizar a Navbar com o nome do usuário
      }, 1000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "E-mail ou senha incorretos.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Entrar na Conta</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">Acesse sua conta para gerenciar e comprar produtos.</p>

        {message && (
          <div
            className={`p-4 mb-6 rounded-xl text-sm font-medium border ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm mt-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Ainda não tem uma conta?{" "}
          <Link to="/registro" className="text-blue-600 font-semibold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};