import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { getProductById, updateProduct } from "../services/productService";
import { ImageIcon, PlusIcon, XIcon } from "../components/Icons";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

const categories = [
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "informatica", label: "Informática" },
  { value: "celulares", label: "Celulares" },
  { value: "acessorios", label: "Acessórios" },
  { value: "perifericos", label: "Periféricos" },
  { value: "games", label: "Games" },
  { value: "audio", label: "Áudio" },
  { value: "outros", label: "Outros" },
];

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [images, setImages] = useState<string[]>([""]);
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const navigateTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navigateTimeoutRef.current !== null) {
        window.clearTimeout(navigateTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFetching(false);
      setFetchError("Produto não encontrado.");
      return;
    }

    let active = true;

    getProductById(id)
      .then((product) => {
        if (!active) return;
        setTitle(product.title);
        setCategory(product.category);
        setPrice(product.price);
        setStock(typeof product.stock === "number" ? product.stock : "");
        setImages(product.images && product.images.length > 0 ? product.images : [""]);
        setDescription(product.description || "");
        setFetchError(null);
      })
      .catch(() => {
        if (!active) return;
        setFetchError("Não foi possível carregar o produto.");
      })
      .finally(() => {
        if (active) setFetching(false);
      });

    return () => { active = false; };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !category || !price || images.filter((i) => i.trim()).length === 0) {
      setMessage({
        text: "Preencha os campos obrigatórios, incluindo pelo menos uma imagem.",
        type: "error",
      });
      return;
    }

    const validImages = images.map((img) => img.trim()).filter(Boolean);

    try {
      setLoading(true);

      if (!id) {
        setMessage({ text: "Produto não encontrado.", type: "error" });
        return;
      }

      await updateProduct(id, {
        title,
        category,
        price: Number(price),
        images: validImages,
        description,
        ...(typeof stock === "number" && stock >= 0 ? { stock } : {}),
      });

      setMessage({
        text: "Produto atualizado com sucesso!",
        type: "success",
      });

      navigateTimeoutRef.current = window.setTimeout(() => {
        navigate("/meus-produtos");
      }, 1200);
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

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm font-medium text-muted">Carregando produto...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mx-auto my-10 max-w-2xl px-4">
        <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-lift">
          <p className="text-sm text-muted">{fetchError}</p>
          <button
            onClick={() => navigate("/meus-produtos")}
            className="mt-4 text-sm font-semibold text-brand-600 hover:underline"
          >
            Voltar para Minha Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 max-w-2xl px-4">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-lift sm:p-8">
        <h2 className="text-2xl font-bold text-ink">Editar produto</h2>

        <p className="mb-6 mt-1 text-sm text-muted">
          Altere as informações do produto e salve as mudanças.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="edit-title" className="mb-1 block text-sm font-semibold text-ink">
              Título do produto *
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Teclado Mecânico RGB"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-category" className="mb-1 block text-sm font-semibold text-ink">
                Categoria *
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className={`${inputClass} bg-white`}
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

            <div>
              <label htmlFor="edit-price" className="mb-1 block text-sm font-semibold text-ink">
                Preço (R$) *
              </label>
              <input
                id="edit-price"
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="Ex: 299.90"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-stock" className="mb-1 block text-sm font-semibold text-ink">
                Quantidade em estoque{" "}
                <span className="text-xs font-normal text-muted">(opcional)</span>
              </label>
              <input
                id="edit-stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="Ex: 10"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">
              URLs das imagens *{" "}
              <span className="text-xs font-normal text-muted">
                (a primeira é a principal)
              </span>
            </label>

            <div className="space-y-3">
              {images.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 shrink-0 text-muted" />
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => {
                      const next = [...images];
                      next[index] = e.target.value;
                      setImages(next);
                    }}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className={inputClass}
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-danger-soft hover:text-danger"
                      aria-label="Remover imagem"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {images.length < 10 && (
              <button
                type="button"
                onClick={() => setImages([...images, ""])}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                <PlusIcon className="h-4 w-4" />
                Adicionar outra imagem
              </button>
            )}
          </div>

          <div>
            <label htmlFor="edit-description" className="mb-1 block text-sm font-semibold text-ink">
              Descrição
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre as especificações, garantia ou destaques do produto..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/meus-produtos")}
              className="w-1/3 rounded-xl bg-surface py-3 text-sm font-semibold text-ink transition-colors hover:bg-line"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-2/3 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700 ${
                loading ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
