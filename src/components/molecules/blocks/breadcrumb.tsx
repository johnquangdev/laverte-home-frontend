import NextLink from "next/link";
import type { FC } from "react";

import { cn } from "@/utils/common";

type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

type Props = {
  items: BreadcrumbItem[];
  className?: string;
};

export const Breadcrumb: FC<Props> = ({ items, className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("font-montserrat text-gray pt-8 text-sm", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index}>
            {item.href && !isLast ? (
              <NextLink
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </NextLink>
            ) : (
              <span className={cn((isLast || item.active) && "text-primary")}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="mx-2 text-gray-300">/</span>}
          </span>
        );
      })}
    </nav>
  );
};
