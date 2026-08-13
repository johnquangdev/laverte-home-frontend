import NextLink from "next/link";
import type { ComponentProps, FC, ReactNode } from "react";

import { cn } from "@/utils/common";

type Props = ComponentProps<typeof NextLink> & {
  children: ReactNode;
};

export const Link: FC<Props> = ({ children, className, ...props }) => {
  return (
    <NextLink
      className={cn(
        "font-montserrat hover:text-secondary text-[1rem] leading-[1.2] font-normal tracking-normal text-black transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
};
