import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { FC, ReactNode } from "react";

import { PATH } from "@/constants/path";

type Props = {
  /** Current page, shown as the last breadcrumb crumb. */
  title: string;
  actions?: ReactNode;
};

export const AdminPageHeader: FC<Props> = ({ title, actions }) => (
  <div className="border-admin-line flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
      <Link
        href={PATH.admin.bookings}
        className="text-admin-body hover:text-admin-ink focus-visible:ring-admin-accent rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        Home
      </Link>
      <ChevronRight
        aria-hidden="true"
        className="text-admin-body size-4 shrink-0"
      />
      <span className="text-admin-ink truncate text-sm font-medium">
        {title}
      </span>
    </nav>
    {actions ? (
      <div className="flex flex-wrap items-center gap-2">{actions}</div>
    ) : null}
  </div>
);
