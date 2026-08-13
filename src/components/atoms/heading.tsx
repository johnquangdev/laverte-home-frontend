import type { FC, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/common";

const OPENING_QUOTE = "\u201C";
const CLOSING_QUOTE = "\u201D";

const replaceQuotes = (value: ReactNode): ReactNode => {
  if (typeof value === "string") {
    let isOpening = true;

    return value.replace(/"/g, () => {
      const quote = isOpening ? OPENING_QUOTE : CLOSING_QUOTE;
      isOpening = !isOpening;
      return quote;
    });
  }

  if (Array.isArray(value)) {
    return value.map(replaceQuotes);
  }

  return value;
};

type HeadingLevel = 1 | 2 | 3 | 4;

type Props = HTMLAttributes<HTMLHeadingElement> & {
  level: HeadingLevel;
  children: ReactNode;
  breakWords?: boolean;
};

const headingStyles: Record<HeadingLevel, string> = {
  1: "font-playfair text-[2rem] font-normal leading-[1.2] tracking-[-0.02em] sm:text-[3rem] sm:leading-[1.15]",
  2: "font-montserrat text-[1.25rem] font-medium leading-[1.25] tracking-[-0.02em] sm:text-[1.5rem]",
  3: "font-playfair text-[1.5rem] font-normal leading-[1.25] tracking-[-0.02em] sm:text-[2rem]",
  4: "font-playfair text-[1.25rem] font-normal leading-[1.25] tracking-[-0.02em] sm:text-[1.375rem]",
};

export const Heading: FC<Props> = ({
  level,
  children,
  className,
  breakWords = false,
  ...props
}) => {
  const Component = `h${level}` as const;
  const baseStyles = headingStyles[level];

  return (
    <Component
      className={cn(
        baseStyles,
        breakWords && "text-balance wrap-break-word whitespace-pre-line",
        className
      )}
      {...props}
    >
      {replaceQuotes(children)}
    </Component>
  );
};
