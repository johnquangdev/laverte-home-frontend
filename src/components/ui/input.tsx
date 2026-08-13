import * as React from "react";

import { cn } from "@/utils/common";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-primary placeholder:text-gray selection:bg-primary border-beige text-primary h-9 w-full min-w-0 rounded-none! border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-2",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
