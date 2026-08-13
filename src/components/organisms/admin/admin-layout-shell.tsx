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
      router.replace(PATH.adminLogin);
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#071612] text-emerald-50">
      <AdminSidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#f8fffb] text-slate-900">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
    </div>
  );
};
