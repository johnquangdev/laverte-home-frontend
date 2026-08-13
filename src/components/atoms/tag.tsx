import type { FC, HTMLAttributes } from "react";

import { cn } from "@/utils/common";

type Props = HTMLAttributes<HTMLSpanElement>;

export const Tag: FC<Props> = ({ className, children, ...props }) => {
  return (
    <span
      className={cn(
        "font-montserrat text-gray bg-beige inline-flex items-center px-5 py-2 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
