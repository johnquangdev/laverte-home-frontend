import type { FC } from "react";

import { Link } from "@/components/atoms/link";
import { PATH } from "@/constants/path";

export const Footer: FC = () => {
  return (
    <footer className="border-t border-emerald-100 bg-white px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-emerald-800/70 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} La Verte Home</p>
        <Link
          href={PATH.adminLogin}
          className="text-emerald-800 hover:underline"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
};
