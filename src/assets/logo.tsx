import Image from "next/image";
import type { FC } from "react";

import logo from "@/assets/imgs/logo.png";
import { cn } from "@/utils/common";

type Props = {
  className?: string;
};

const LOGO_WIDTH = 2201;
const LOGO_HEIGHT = 714;

export const Logo: FC<Props> = ({ className }) => {
  return (
    <Image
      src={logo}
      alt="La Verte Home"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority
      className={cn(
        "h-[22px] w-auto max-w-[118px] lg:h-auto lg:w-[220px] lg:max-w-none",
        className
      )}
    />
  );
};
