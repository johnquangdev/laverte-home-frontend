import type { FC } from "react";

import { cn } from "@/utils/common";

type Props = {
  className?: string;
};

export const MenuIcon: FC<Props> = ({ className }) => (
  <span
    className={cn("flex w-[31px] flex-col gap-[9px]", className)}
    aria-hidden
  >
    <span className="h-0.5 w-full rounded-[1px] bg-current" />
    <span className="h-0.5 w-full rounded-[1px] bg-current" />
  </span>
);
