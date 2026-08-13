import type { ComponentProps, FC } from "react";

import { cn } from "@/utils/common";

type Props = ComponentProps<"span">;

export const Spinner: FC<Props> = ({ className, ...props }) => {
  return (
    <span
      aria-hidden
      className={cn(
        "border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4",
        className
      )}
      {...props}
    />
  );
};

export const LabeledSpinner: FC<Props> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner className={className} {...props} />
      <p className="text-gray font-montserrat text-sm tracking-[0.2em] uppercase">
        {children}
      </p>
    </div>
  );
};
