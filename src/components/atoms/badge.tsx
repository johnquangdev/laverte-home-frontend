import type { FC } from "react";

import { cn } from "@/utils/common";

type Props = {
  count: number;
  max?: number;
  className?: string;
};

export const Badge: FC<Props> = ({ count, max = 99, className }) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={cn(
        "bg-primary h-4 w-4 min-w-4 rounded-full text-center align-middle text-[9px] leading-4 text-white",
        className
      )}
    >
      {displayCount}
    </span>
  );
};
