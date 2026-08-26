"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { FC } from "react";

import { Button } from "@/components/atoms/button";
import { PATH } from "@/constants/path";
import { useLogoutMutation } from "@/hooks/mutations/booking";
import { useAuthStore } from "@/stores/auth";

const NAV = [
  { href: PATH.admin.bookings, label: "Lịch đặt phòng" },
  { href: PATH.admin.overview, label: "Doanh thu" },
];

export const AdminSidebar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const logout = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } finally {
      clearSession();
      router.push(PATH.admin.login.en);
    }
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-emerald-900/60 bg-[#0a1f18] p-4">
      <div className="mb-6 px-2 pt-[env(safe-area-inset-top)]">
        <p className="text-xl font-semibold text-emerald-50">La Verte</p>
        <p className="text-xs text-emerald-300/70">Admin</p>
        {user?.email ? (
          <p className="mt-2 truncate text-xs text-emerald-200/60">
            {user.email}
          </p>
        ) : null}
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-500 text-emerald-950"
                  : "text-emerald-200/80 hover:bg-emerald-900/50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-2 pb-[env(safe-area-inset-bottom)]">
        <Button
          type="button"
          variant="dark-outline"
          className="w-full"
          loading={logout.isPending}
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
};
