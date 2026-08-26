"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, FC, MouseEvent, ReactNode } from "react";

import { PATH } from "@/constants/path";
import { useQuizCompleted } from "@/hooks/use-quiz-completed";
import { cn } from "@/utils/common";

type Props = ComponentProps<typeof NextLink> & {
  children: ReactNode;
  requireQuiz?: boolean;
};

const hrefToString = (href: Props["href"]) => {
  if (typeof href === "string") return href;
  if (!href || typeof href !== "object") return "";
  const path = "pathname" in href ? String(href.pathname ?? "") : "";
  const query = "search" in href ? String(href.search ?? "") : "";
  return `${path}${query}`;
};

const isCollectionHref = (href: Props["href"]) => {
  const value = hrefToString(href);
  return (
    value.includes(PATH.collections.vi) || value.includes(PATH.collections.en)
  );
};

export const QuizGuardLink: FC<Props> = ({
  children,
  className,
  href,
  onClick,
  requireQuiz = false,
  ...props
}) => {
  const router = useRouter();
  const { completed, isReady } = useQuizCompleted();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const shouldGuard =
      isReady && !completed && (requireQuiz || isCollectionHref(href));

    if (shouldGuard) {
      event.preventDefault();
      router.push(PATH.quizzes.doing.vi);
    }
  };

  return (
    <NextLink
      href={href}
      onClick={handleClick}
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
