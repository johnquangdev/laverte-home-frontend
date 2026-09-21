"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { FC, ReactNode } from "react";

import { AdminSidebar } from "@/components/organisms/admin/admin-sidebar";
import { PATH } from "@/constants/path";
import { useAuthStore } from "@/stores/auth";

type Props = {
  children: ReactNode;
};

export const AdminLayoutShell: FC<Props> = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace(PATH.admin.login.en);
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return null;
  }

  return (
    // h-dvh bounds the shell so the white panel below owns the only scroll:
    // the rail and the mobile nav stay put. Every flex ancestor down to that
    // panel needs min-h-0, or it sits at its content height and pushes the
    // shell open instead of scrolling.
    <div className="bg-admin-page flex h-dvh flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:py-5 lg:pr-5">
        {/* The reference floats content as one white panel on the grey page.
            Below lg it goes full-bleed — a 16px gutter each side is worth more
            than the rounded corners on a phone. */}
        <main className="border-admin-line bg-admin-card lg:rounded-card min-h-0 flex-1 overflow-y-auto border-x-0 border-y lg:border-x">
          <div className="px-4 py-5 sm:px-6 sm:py-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
