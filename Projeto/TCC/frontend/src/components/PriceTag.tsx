import React from "react";
import { formatPrice } from "../utils/format";

interface PriceTagProps {
  value: number | string | null | undefined;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  contrast?: "default" | "success";
}

const sizeClasses: Record<NonNullable<PriceTagProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl",
};

const contrastClasses: Record<NonNullable<PriceTagProps["contrast"]>, string> = {
  default: "text-ink",
  success: "text-success",
};

export const PriceTag: React.FC<PriceTagProps> = ({
  value,
  className = "",
  size = "md",
  contrast = "default",
}) => (
  <span
    className={`font-mono font-extrabold tracking-tight ${sizeClasses[size]} ${contrastClasses[contrast]} ${className}`}
  >
    {formatPrice(value)}
  </span>
);