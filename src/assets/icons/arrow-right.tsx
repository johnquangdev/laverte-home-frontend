import type { FC, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export const ArrowRight: FC<Props> = (props) => {
  return (
    <svg
      viewBox="0 0 33 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      {...props}
    >
      <path
        d="M32.3536 4.03544C32.5488 3.84018 32.5488 3.52359 32.3536 3.32833L29.1716 0.146351C28.9763 -0.0489113 28.6597 -0.0489113 28.4645 0.146351C28.2692 0.341613 28.2692 0.658195 28.4645 0.853458L31.2929 3.68188L28.4645 6.51031C28.2692 6.70557 28.2692 7.02216 28.4645 7.21742C28.6597 7.41268 28.9763 7.41268 29.1716 7.21742L32.3536 4.03544ZM0 3.68188V4.18188H32V3.68188V3.18188H0V3.68188Z"
        fill="currentColor"
      />
    </svg>
  );
};
