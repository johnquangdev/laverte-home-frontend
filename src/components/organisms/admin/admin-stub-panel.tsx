import { Construction } from "lucide-react";
import type { FC } from "react";

import { AdminPageHeader } from "@/components/organisms/admin/admin-page-header";

type Props = {
  title: string;
  /** What the screen will do once it exists. */
  purpose: string;
  /**
   * Endpoints this screen needs. Naming them here keeps a seeded tab honest —
   * an empty page that says nothing reads like a bug.
   */
  endpoints: { method: string; path: string; exists: boolean }[];
};

export const AdminStubPanel: FC<Props> = ({ title, purpose, endpoints }) => (
  <div className="grid gap-5">
    <AdminPageHeader title={title} />

    <div className="border-admin-line rounded-card flex flex-col items-center gap-3 border border-dashed px-6 py-10 text-center">
      <span
        aria-hidden="true"
        className="border-admin-line bg-admin-page text-admin-body flex size-11 items-center justify-center rounded-full border"
      >
        <Construction className="size-5" />
      </span>
      <div>
        <p className="text-admin-ink text-sm font-medium">Chưa dựng màn này</p>
        <p className="text-admin-body mx-auto mt-1 max-w-md text-sm">
          {purpose}
        </p>
      </div>
    </div>

    <div className="border-admin-line rounded-card overflow-hidden border">
      <p className="text-admin-body bg-admin-page border-admin-line border-b px-4 py-2.5 text-xs font-medium">
        Endpoint cần dùng
      </p>
      <ul className="divide-admin-line divide-y">
        {endpoints.map((e) => (
          <li
            key={`${e.method} ${e.path}`}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <span className="text-admin-ink text-sm">
              <span className="text-admin-body">{e.method}</span> {e.path}
            </span>
            <span
              className={`rounded-pill border px-2.5 py-1 text-xs font-medium ${
                e.exists
                  ? "bg-state-paid border-state-paid-line text-state-paid-fg"
                  : "bg-state-pending border-state-pending-line text-state-pending-fg"
              }`}
            >
              {e.exists ? "Backend đã có" : "Backend chưa có"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
