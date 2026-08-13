import type { ComponentProps, FC, ReactNode } from "react";

import { cn } from "@/utils/common";

type Props = ComponentProps<"div"> & {
  children: ReactNode;
  halfWidth?: boolean;
  plus?: boolean;
};

export const Container: FC<Props> = ({
  children,
  className,
  halfWidth,
  plus,
  ...props
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] px-5",
        plus && "max-w-[1440px]",
        halfWidth && "mx-0 px-0",
        {
          "max-w-[calc(1280px/2)]": halfWidth && !plus,
          "max-w-[calc(1440px/2)]": halfWidth && plus,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
