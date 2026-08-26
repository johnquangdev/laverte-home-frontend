"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export const useScrollToTop = () => {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);
};
