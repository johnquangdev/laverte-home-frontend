"use client";

import * as React from "react";

import { cn } from "@/utils/common";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-beige placeholder:text-gray text-primary focus-visible:border-primary focus-visible:ring-primary/20 flex field-sizing-content min-h-16 w-full rounded-none! border bg-white px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
