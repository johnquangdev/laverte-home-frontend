import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  content: string;
  position?: "left" | "right" | "top" | "bottom";
  className?: string;
};

const positionClasses = {
  left: "right-full mr-3 top-1/2 -translate-y-1/2",
  right: "left-full ml-3 top-1/2 -translate-y-1/2",
  top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
  bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
};

const arrowClasses = {
  left: "left-full top-1/2 -translate-y-1/2 border-4 border-l-primary border-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-4 border-r-primary border-transparent",
  top: "bottom-full left-1/2 -translate-x-1/2 border-4 border-t-primary border-transparent",
  bottom:
    "top-full left-1/2 -translate-x-1/2 border-4 border-b-primary border-transparent",
};

export const Tooltip: FC<Props> = ({
  children,
  content,
  position = "left",
  className,
}) => {
  return (
    <span className={`group relative ${className || ""}`}>
      {children}
      <span
        className={`bg-primary pointer-events-none absolute rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 ${positionClasses[position]}`}
      >
        {content}
        <span className={`absolute ${arrowClasses[position]}`} />
      </span>
    </span>
  );
};
