import React from "react";

interface BadgeStatusProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-warn-soft text-amber-700" },
  processando: { label: "Processando", className: "bg-brand-50 text-brand-700" },
  enviado: { label: "Enviado", className: "bg-brand-50 text-brand-700" },
  entregue: { label: "Entregue", className: "bg-success-soft text-green-700" },
  cancelado: { label: "Cancelado", className: "bg-danger-soft text-red-700" },
  aprovado: { label: "Aprovado", className: "bg-success-soft text-green-700" },
  rejeitado: { label: "Rejeitado", className: "bg-danger-soft text-red-700" },
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({ status, className = "" }) => {
  const badge = statusMap[status] || {
    label: status,
    className: "bg-line text-muted",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badge.className} ${className}`}
    >
      {badge.label}
    </span>
  );
};