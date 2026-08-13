import type { FC, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/common";

type ParagraphLevel = 1 | 2 | 3;

type Props = HTMLAttributes<HTMLParagraphElement> & {
  level: ParagraphLevel;
  children: ReactNode;
  breakWords?: boolean;
};

const paragraphStyles: Record<ParagraphLevel, string> = {
  1: "font-montserrat text-[0.9375rem] font-normal leading-[1.2] tracking-[-0.01em] sm:text-[1.0625rem]",
  2: "font-montserrat text-[0.8125rem] font-normal leading-[1.35] tracking-[-0.01em] sm:text-[0.875rem] sm:leading-[1.4]",
  3: "font-montserrat text-[0.75rem] font-normal leading-[1.3] tracking-[0.01em] sm:text-[0.8125rem]",
};

export const Paragraph: FC<Props> = ({
  level,
  children,
  className,
  breakWords = false,
  ...props
}) => {
  const baseStyles = paragraphStyles[level];

  return (
    <p
      className={cn(
        baseStyles,
        breakWords && "text-balance wrap-break-word whitespace-pre-line",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};
