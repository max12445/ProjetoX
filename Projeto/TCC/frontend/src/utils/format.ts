export const formatPrice = (value: number | string | null | undefined): string => {
  const amount = Number(value || 0);
  return `R$ ${amount.toFixed(2).replace(".", ",")}`;
};

export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
};