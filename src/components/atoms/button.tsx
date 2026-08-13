import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

import { ArrowRight } from "@/assets/icons/arrow-right";
import { cn } from "@/utils/common";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "dark-outline"
  | "beige-outline"
  | "text"
  | "text-beige"
  | "dark-brown";
type ButtonShape = "pill" | "rect";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  arrow?: boolean;
  loading?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-black text-white border border-black hover:bg-black/90",
  secondary: "bg-primary text-white border border-primary hover:bg-primary/90",
  outline:
    "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white",
  "dark-outline": "bg-gray text-white border border-white hover:bg-gray/80",
  "beige-outline":
    "border-beige text-beige bg-transparent hover:bg-white/10 border-[1.6px]",
  text: "border-transparent bg-transparent text-primary hover:text-primary/80",
  "text-beige":
    "border-transparent bg-transparent text-beige hover:text-beige/80",
  "dark-brown":
    "bg-dark-brown text-white border border-dark-brown hover:bg-dark-brown/90",
};

const shapeStyles: Record<ButtonShape, string> = {
  pill: "rounded-full",
  rect: "rounded-none",
};

export const Button: FC<Props> = ({
  children,
  variant = "primary",
  shape = "pill",
  className,
  arrow,
  loading = false,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "font-montserrat flex min-h-11 cursor-pointer items-center justify-center gap-2 px-5 py-3 text-[1rem] font-normal transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        shapeStyles[shape],
        variantStyles[variant],
        loading && "pointer-events-none",
        className
      )}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      <span>{children}</span>
      {!loading && arrow && <ArrowRight />}
    </button>
  );
};
