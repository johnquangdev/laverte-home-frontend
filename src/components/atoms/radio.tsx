"use client";

import { useId } from "react";
import type { FC, InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/common";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactNode;
};

export const Radio: FC<Props> = ({
  children,
  className,
  id,
  disabled,
  checked,
  ...props
}) => {
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex items-center">
        <input
          type="radio"
          id={radioId}
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={radioId}
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
            checked ? "border-secondary" : "border-primary",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          )}
        >
          {checked && <div className="bg-secondary h-2.5 w-2.5 rounded-full" />}
        </label>
      </div>
      {children && (
        <label
          htmlFor={radioId}
          className={cn(
            "cursor-pointer",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {children}
        </label>
      )}
    </div>
  );
};
