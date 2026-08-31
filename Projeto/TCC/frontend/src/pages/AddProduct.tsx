import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { createProduct } from "../services/productService";

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [loading, setLoading] = useState(false);

  // Categorias disponíveis
  const categories = [
    { value: "eletronicos", label: "💻 Eletrônicos" },
    { value: "informatica", label: "🖥️ Informática" },
    { value: "celulares", label: "📱 Celulares" },
    { value: "acessorios", label: "🔌 Acessórios" },
    { value: "perifericos", label: "⌨️ Periféricos" },
    { value: "games", label: "🎮 Games" },
    { value: "audio", label: "🎧 Áudio" },
    { value: "outros", label: "📦 Outros" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !category || !price || !image) {
      setMessage({
        text: "Por favor, preencha todos os campos obrigatórios (*).",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      await createProduct({
        title,
        category,
        price: Number(price),
        image,
        description,
      });

      setMessage({
        text: "Produto cadastrado com sucesso! Redirecionando...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError
          ? error.response?.data?.message
          : undefined;

      setMessage({
        text: errorMsg || "Erro ao conectar com o servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cadastrar Novo Produto
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Insiro as informações necessárias para registrar o produto no sistema.
        </p>

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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Título do Produto *
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Teclado Mecânico RGB"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          {/* Categoria e preço */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Categoria *
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
              >
                <option value="" disabled>
                  Selecione uma categoria
                </option>

                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preço */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Preço (R$) *
              </label>

              <input
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="Ex: 299.90"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              URL da Imagem *
            </label>

            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descrição
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre as especificações, garantia ou destaques do produto..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Salvando..." : "Cadastrar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};