"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FC } from "react";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

const BTN =
  "rounded-field min-h-control-sm focus-visible:ring-admin-accent inline-flex min-w-8 items-center justify-center border px-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40";

export const Pagination: FC<Props> = ({
  page,
  pageSize,
  total,
  onPageChange,
}) => {
  const pageCount = Math.max(Math.ceil(total / pageSize), 1);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Window of at most five numbers around the current page; long runs collapse
  // rather than wrapping the footer onto a second line.
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pages = Array.from(
    { length: Math.min(5, pageCount) },
    (_, i) => start + i
  ).filter((p) => p >= 1 && p <= pageCount);

  return (
    <div className="border-admin-line bg-admin-page flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5">
      <p className="text-admin-body text-xs tabular-nums">
        Hiển thị {from}–{to} trên {total}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`${BTN} border-admin-field text-admin-body`}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={`${BTN} tabular-nums ${
              p === page
                ? "border-admin-ink bg-admin-ink text-white"
                : "border-admin-field text-admin-body hover:text-admin-ink"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          aria-label="Trang sau"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className={`${BTN} border-admin-field text-admin-body`}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
};
