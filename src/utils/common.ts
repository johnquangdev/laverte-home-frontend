import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const formatPrice = (price: number | undefined): string => {
  if (!price) return "";
  return `${price.toLocaleString()}đ`;
};

export const formatVnd = (price: number | undefined): string => {
  if (price === undefined) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};
