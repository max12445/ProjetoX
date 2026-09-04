import React, { useCallback, useEffect, useState } from "react";
import {
  getSupportMessages,
  updateSupportMessageStatus,
  type SupportMessage,
} from "../services/supportService";
import { EmptyState } from "../components/EmptyState";
import { formatDate } from "../utils/format";
import { MailIcon } from "../components/Icons";

const STATUS_OPTIONS = [
  { value: "aberto", label: "Aberto", labelClass: "bg-warn-soft text-amber-700" },
  { value: "respondido", label: "Respondido", labelClass: "bg-brand-50 text-brand-700" },
  { value: "resolvido", label: "Resolvido", labelClass: "bg-success-soft text-green-700" },
] as const;

type SupportStatus = (typeof STATUS_OPTIONS)[number]["value"];

export const AdminSupport: React.FC = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const data = await getSupportMessages(page);
      setMessages(data.messages ?? data.data ?? []);
      setPagination(data.pagination ?? { page: 1, totalPages: 1, total: 0 });
      setError(null);
    } catch {
      setError("Não foi possível carregar as mensagens.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (messageId: string, newStatus: SupportStatus) => {
    setUpdatingId(messageId);
    try {
      await updateSupportMessageStatus(messageId, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, status: newStatus } : m))
      );
    } catch {
      setError("Erro ao atualizar o status da mensagem.");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusLabel = (status: string) => {
    const option = STATUS_OPTIONS.find((s) => s.value === status);
    return option?.label ?? status;
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-sm font-medium text-muted">Carregando mensagens...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Mensagens de suporte</h1>
        <p className="mt-1 text-sm text-muted">
          {pagination.total} {pagination.total === 1 ? "mensagem recebida" : "mensagens recebidas"}
          {" "}dos clientes.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-danger-soft p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <EmptyState
          icon={<MailIcon />}
          title="Nenhuma mensagem"
          description="Quando um cliente entrar em contato pelo suporte, a mensagem aparecerá aqui."
        />
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const userInfo =
              typeof message.user === "object" && message.user
                ? `${message.user.name || ""} ${message.user.email || ""}`.trim()
                : "";

            return (
              <div
                key={message._id}
                className="rounded-2xl border border-line bg-white p-5 shadow-lift"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-ink">{message.subject}</h3>
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize text-muted">
                        {statusLabel(message.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {message.name} · {message.email}
                      {userInfo ? ` · Conta: ${userInfo}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">
                    {formatDate(message.createdAt)}
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap rounded-xl bg-surface p-4 text-sm text-ink">
                  {message.message}
                </p>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <label className="text-xs font-semibold text-muted" htmlFor={`status-${message._id}`}>
                    Status
                  </label>
                  <select
                    id={`status-${message._id}`}
                    value={message.status}
                    onChange={(e) =>
                      handleStatusChange(message._id, e.target.value as SupportStatus)
                    }
                    disabled={updatingId === message._id}
                    className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination.totalPages > 1 && !loading && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => fetchMessages(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="flex items-center px-3 text-sm font-medium text-muted">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchMessages(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;