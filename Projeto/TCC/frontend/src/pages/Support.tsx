import React, { useState } from "react";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { createSupportMessage } from "../services/supportService";
import { MailIcon, PackageIcon, TruckIcon, ZapIcon } from "../components/Icons";

const FAQ = [
  {
    question: "Quanto tempo demora a entrega?",
    answer:
      "O prazo depende do comerciante e da sua região. Você acompanha o status do pedido em 'Meus Pedidos'.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "No checkout você pode usar cartão, Pix ou boleto. O pagamento é processado de forma simulada na plataforma.",
  },
  {
    question: "Como posso cancelar um pedido?",
    answer:
      "Envie uma mensagem para o suporte informando o número do pedido, ou aguarde o contato da loja para cancelamento.",
  },
];

export const Support: React.FC = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(null);
    setError(null);

    try {
      const result = await createSupportMessage({ name, email, subject, message });
      setSuccess(result.message);
      setSubject("");
      setMessage("");
    } catch (err) {
      const errorMsg =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setError(errorMsg || "Erro ao enviar a mensagem. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Suporte</h1>
        <p className="mt-1 text-sm text-muted">
          Precisa de ajuda? Envie uma mensagem que nossa equipe responde em breve.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-white p-6 shadow-lift"
        >
          <h2 className="flex items-center gap-2 text-base font-bold text-ink">
            <MailIcon className="h-5 w-5 text-brand-600" />
            Fale conosco
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Assunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                minLength={3}
                placeholder="Ex: Problema com meu pedido"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Mensagem</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                rows={5}
                placeholder="Descreva o que aconteceu..."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>

          {error && (
            <div
              className="mt-4 rounded-xl border border-red-200 bg-danger-soft p-3 text-sm font-medium text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mt-4 rounded-xl border border-green-200 bg-success-soft p-3 text-sm font-medium text-green-700"
              role="status"
            >
              {success}
            </div>
          )}

          <div className="mt-5">
            <button
              type="submit"
              disabled={sending}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Enviar mensagem"}
            </button>
          </div>
        </form>

        {/* FAQ */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-lift">
          <h2 className="text-base font-bold text-ink">Perguntas frequentes</h2>
          <div className="mt-5 space-y-5">
            {FAQ.map((item) => (
              <div key={item.question}>
                <h3 className="flex items-start gap-2 text-sm font-semibold text-ink">
                  {item.question.startsWith("Quanto") ? (
                    <TruckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  ) : item.question.startsWith("Quais") ? (
                    <ZapIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  ) : (
                    <PackageIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  )}
                  {item.question}
                </h3>
                <p className="mt-1 pl-6 text-sm text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;