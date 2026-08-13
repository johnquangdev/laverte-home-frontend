import type { FC, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/common";

type Props = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "p" | "span" | "div" | "figcaption";
};

export const Caption: FC<Props> = ({
  children,
  className,
  as: Component = "p",
  ...props
}) => {
  return (
    <Component
      className={cn(
        "font-montserrat text-gray text-[0.75rem] leading-[1.4] font-light tracking-[-0.03em]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
