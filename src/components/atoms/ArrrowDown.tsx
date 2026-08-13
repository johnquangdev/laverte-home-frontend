import type { FC, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export const ArrowDown: FC<Props> = (props) => {
  return (
    <svg
      viewBox="0 0 21 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.5 42.2576L10.5 52.5L20.5 42.2576M10.5 52.5V26.5V0.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
