import type { ComponentProps, FC } from "react";

import { cn } from "@/utils/common";

type Props = ComponentProps<"div">;

export const Skeleton: FC<Props> = ({ className, ...props }) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-primary/10 animate-pulse rounded", className)}
      {...props}
    />
  );
};
