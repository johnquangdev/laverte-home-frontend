import type { FC } from "react";

import { Button } from "@/components/atoms/button";
import { Link } from "@/components/atoms/link";
import { PATH } from "@/constants/path";

export const Header: FC = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href={PATH.home} className="flex items-center gap-3 no-underline">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-800 text-sm font-bold text-emerald-50">
            LV
          </span>
          <div>
            <p className="text-lg font-semibold text-emerald-950">
              La Verte Home
            </p>
            <p className="text-xs text-emerald-700/80">
              Homestay · theo giờ · qua đêm · theo ngày
            </p>
          </div>
        </Link>
        <Link href={PATH.book}>
          <Button variant="secondary" shape="pill" arrow>
            Đặt phòng
          </Button>
        </Link>
      </div>
    </header>
  );
};
