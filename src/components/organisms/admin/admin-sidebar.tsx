"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  CalendarDays,
  CalendarOff,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Tags,
  Wallet,
} from "lucide-react";
import type { FC } from "react";

import { PATH } from "@/constants/path";
import { useLogoutMutation } from "@/hooks/mutations/booking";
import { useAuthStore } from "@/stores/auth";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_GROUPS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Quản lý",
    items: [
      { href: PATH.admin.overview, label: "Overview", icon: LayoutDashboard },
      { href: PATH.admin.rooms, label: "Phòng", icon: BedDouble },
      { href: PATH.admin.pricing, label: "Bảng giá", icon: Tags },
      { href: PATH.admin.blockedSlots, label: "Khoá lịch", icon: CalendarOff },
    ],
  },
  {
    heading: "Đặt phòng",
    items: [
      {
        href: PATH.admin.bookings,
        label: "Lịch đặt phòng",
        icon: CalendarDays,
      },
      { href: PATH.admin.payments, label: "Giao dịch", icon: CreditCard },
    ],
  },
  {
    heading: "Hệ thống",
    items: [
      { href: PATH.admin.sepay, label: "Cấu hình SePay", icon: Wallet },
      { href: PATH.admin.settings, label: "Cài đặt", icon: Settings },
    ],
  },
];

// Flattened once so the mobile pill row does not re-walk the groups.
const NAV_FLAT: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

const Wordmark: FC = () => (
  <div className="flex items-center gap-2.5">
    <span
      aria-hidden="true"
      className="bg-admin-ink rounded-field flex size-9 shrink-0 items-center justify-center text-[13px] font-bold tracking-tight text-white"
    >
      LV
    </span>
    <span className="min-w-0">
      <span className="text-admin-ink block text-sm font-semibold">
        La Verte
      </span>
      <span className="text-admin-body block text-xs">Management</span>
    </span>
  </div>
);

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
    <>
      <aside className="bg-admin-sidebar hidden w-72 shrink-0 flex-col gap-6 px-4 py-5 lg:flex">
        <Wordmark />

        {user?.email ? (
          <div className="border-admin-line bg-admin-card rounded-field flex items-center gap-2.5 border px-3 py-2.5">
            <span
              aria-hidden="true"
              className="bg-admin-accent size-2.5 shrink-0 rounded-full"
            />
            <span className="text-admin-ink min-w-0 truncate text-sm">
              {user.email}
            </span>
          </div>
        ) : null}

        {/* The rail is the one scroller in the sidebar: nine items plus three
            headings overflow a short laptop window. */}
        <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-1">
          {NAV_GROUPS.map((group) => (
            <nav key={group.heading} className="flex flex-col gap-1">
              <h2 className="text-admin-ink px-3 pb-1 text-sm font-semibold">
                {group.heading}
              </h2>
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-field min-h-control-lg focus-visible:ring-admin-accent relative flex items-center gap-3 px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                      active
                        ? "bg-admin-card text-admin-ink font-medium"
                        : "text-admin-body hover:bg-admin-card/60"
                    }`}
                  >
                    {/* The rust hairline is what marks the active item in the
                        reference — the white fill alone is too quiet to read. */}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="bg-admin-accent absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full"
                      />
                    ) : null}
                    <Icon aria-hidden="true" className="size-[18px] shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="rounded-field min-h-control-lg text-admin-body hover:text-admin-ink hover:bg-admin-card focus-visible:ring-admin-accent mt-auto flex items-center gap-3 px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
        >
          <LogOut aria-hidden="true" className="size-[18px] shrink-0" />
          {logout.isPending ? "Đang đăng xuất…" : "Đăng xuất"}
        </button>
      </aside>

      {/* Below lg the rail would eat two thirds of a 390px viewport, so the same
          nav becomes a top bar with a scrollable pill row. */}
      <div className="bg-admin-sidebar border-admin-line shrink-0 border-b lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-[env(safe-area-inset-top)] pb-2">
          <Wordmark />
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            aria-label="Đăng xuất"
            className="border-admin-line bg-admin-card rounded-field text-admin-body hover:text-admin-ink focus-visible:ring-admin-accent flex size-11 shrink-0 items-center justify-center border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
          >
            <LogOut aria-hidden="true" className="size-[18px]" />
          </button>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
          {NAV_FLAT.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-pill min-h-control-sm focus-visible:ring-admin-accent flex shrink-0 items-center gap-2 border px-3.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                  active
                    ? "border-admin-ink bg-admin-ink font-medium text-white"
                    : "border-admin-line bg-admin-card text-admin-body"
                }`}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
