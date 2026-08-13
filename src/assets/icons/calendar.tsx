import type { FC, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export const Calendar: FC<Props> = (props) => {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      {...props}
    >
      <rect height="16" rx="2" width="18" x="3" y="4" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
};
