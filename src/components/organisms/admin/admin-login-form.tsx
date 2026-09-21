"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, CalendarDays, KeyRound } from "lucide-react";
import type { FC } from "react";

import { PATH } from "@/constants/path";
import { internalAxiosClient } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import type { SessionEntity } from "@/types/api/entities";

const passwordLoginEnabled =
  process.env.NEXT_PUBLIC_DEV_PASSWORD_LOGIN === "true";

const FIELD =
  "border-admin-field rounded-field min-h-control-lg text-admin-ink placeholder:text-admin-body/60 focus-visible:ring-admin-accent w-full border bg-admin-page/60 px-3.5 text-base transition-shadow focus-visible:ring-2 focus-visible:outline-none";

const HIGHLIGHTS = [
  { icon: CalendarDays, text: "Lịch đặt phòng theo ngày, theo từng home" },
  { icon: KeyRound, text: "Gửi mã cửa qua Zalo ngay khi khách xác nhận" },
  { icon: BarChart3, text: "Doanh thu và tỉ lệ lấp phòng theo tháng" },
];

export const AdminLoginForm: FC = () => {
  // Each method owns its own pending and error state — sharing them made the
  // password button spin on a Google failure and showed Google's error under
  // the password fields.
  const [googlePending, setGooglePending] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setSession = useAuthStore((state) => state.setSession);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setGooglePending(true);
    setGoogleError(null);
    try {
      const response = await internalAxiosClient.get<{ url: string }>(
        "/auth/google/login-url"
      );
      window.location.assign(response.data.url);
    } catch (err) {
      setGoogleError(
        err instanceof Error ? err.message : "Không lấy được URL đăng nhập"
      );
      setGooglePending(false);
    }
  };

  const handlePasswordLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordPending(true);
    setPasswordError(null);
    try {
      const response = await internalAxiosClient.post<SessionEntity>(
        "/auth/password",
        { username, password }
      );
      setSession(response.data);
      router.replace(PATH.admin.bookings);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Đăng nhập thất bại"
      );
      setPasswordPending(false);
    }
  };

  return (
    <div className="bg-admin-card min-h-dvh lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel. Only from lg — on a phone it would push the form below
          the fold for no gain. */}
      <aside className="bg-admin-ink relative hidden overflow-hidden px-12 pt-12 pb-16 lg:flex lg:flex-col">
        {/* One restrained accent glow rather than a gradient wash. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-24 size-[520px] rounded-full opacity-[0.18] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-admin-accent), transparent 70%)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <span
            aria-hidden="true"
            className="rounded-field flex size-10 shrink-0 items-center justify-center bg-white text-sm font-bold tracking-tight text-black"
          >
            LV
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">
              La Verte
            </span>
            <span className="block text-xs text-white/60">Management</span>
          </span>
        </div>

        <div className="relative mt-auto">
          <p className="font-playfair max-w-md text-[34px] leading-[1.15] text-white">
            Một chút chậm. Một khoảng riêng.
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/60">
            Bảng điều hành cho những căn home tại Bảo Lộc.
          </p>

          <ul className="mt-10 grid gap-3.5">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-px flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80"
                >
                  <Icon className="size-3.5" />
                </span>
                <span className="text-sm text-white/70">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-10 lg:min-h-0">
        <div className="mx-auto w-full max-w-[380px]">
          <div className="flex items-center gap-2.5 lg:hidden">
            <span
              aria-hidden="true"
              className="bg-admin-ink rounded-field flex size-9 shrink-0 items-center justify-center text-[13px] font-bold tracking-tight text-white"
            >
              LV
            </span>
            <span>
              <span className="text-admin-ink block text-sm font-semibold">
                La Verte
              </span>
              <span className="text-admin-body block text-xs">Management</span>
            </span>
          </div>

          <h1 className="text-admin-ink mt-8 text-[28px] leading-tight font-semibold tracking-tight lg:mt-0">
            Đăng nhập
          </h1>
          <p className="text-admin-body mt-2 text-sm">
            Dùng tài khoản Google được cấp quyền admin.
          </p>

          {googleError ? (
            <p
              className="text-danger-fg bg-state-cancelled rounded-field mt-5 px-3 py-2.5 text-sm"
              aria-live="polite"
            >
              {googleError}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googlePending}
            className="rounded-pill min-h-control-lg bg-admin-accent focus-visible:ring-admin-accent mt-6 flex w-full items-center justify-center px-5 text-base font-medium text-white shadow-[0_1px_2px_rgba(23,23,23,0.12)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
          >
            {googlePending ? "Đang chuyển…" : "Đăng nhập với Google"}
          </button>

          {passwordLoginEnabled ? (
            <form onSubmit={handlePasswordLogin} className="mt-8">
              <div className="flex items-center gap-3">
                <span className="bg-admin-line h-px flex-1" />
                <span className="text-admin-body text-xs">
                  Chỉ dùng khi dev
                </span>
                <span className="bg-admin-line h-px flex-1" />
              </div>

              {passwordError ? (
                <p
                  className="text-danger-fg bg-state-cancelled rounded-field mt-5 px-3 py-2.5 text-sm"
                  aria-live="polite"
                >
                  {passwordError}
                </p>
              ) : null}

              <div className="mt-5 grid gap-4">
                <label className="grid gap-1.5">
                  <span className="text-admin-body text-sm">Tên đăng nhập</span>
                  <input
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    spellCheck={false}
                    placeholder="admin…"
                    required
                    className={FIELD}
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-admin-body text-sm">Mật khẩu</span>
                  <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className={FIELD}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={passwordPending}
                className="rounded-pill min-h-control-lg border-admin-field text-admin-ink hover:bg-admin-page focus-visible:ring-admin-accent mt-5 flex w-full items-center justify-center border bg-white px-5 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
              >
                {passwordPending
                  ? "Đang đăng nhập…"
                  : "Đăng nhập bằng mật khẩu"}
              </button>
            </form>
          ) : null}

          <Link
            href={PATH.home}
            className="text-admin-body hover:text-admin-ink focus-visible:ring-admin-accent mt-8 flex items-center justify-center gap-1.5 rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Về trang khách
          </Link>
        </div>
      </main>
    </div>
  );
};
