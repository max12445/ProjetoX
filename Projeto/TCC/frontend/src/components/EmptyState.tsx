import React from "react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, children }) => (
  <div className="mx-auto max-w-lg rounded-2xl border border-line bg-white p-12 text-center shadow-lift">
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 [&>svg]:h-6 [&>svg]:w-6">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-ink">{title}</h3>
    {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    {children && <div className="mt-6">{children}</div>}
  </div>
);