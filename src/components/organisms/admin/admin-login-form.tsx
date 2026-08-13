"use client";

import { useState } from "react";
import Link from "next/link";
import type { FC } from "react";

import { Button } from "@/components/atoms/button";
import { PATH } from "@/constants/path";
import { internalAxiosClient } from "@/lib/axios";

export const AdminLoginForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await internalAxiosClient.get<{ url: string }>(
        "/auth/google/login-url"
      );
      window.location.assign(response.data.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không lấy được URL đăng nhập"
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#071612] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-emerald-900/40 bg-[#0a1f18] p-6 text-emerald-50">
        <h1 className="text-2xl font-semibold">La Verte Admin</h1>
        <p className="mt-2 text-sm text-emerald-200/70">
          Đăng nhập bằng Google để quản lý lịch và doanh thu.
        </p>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        <Button
          type="button"
          variant="secondary"
          className="mt-6 w-full"
          loading={loading}
          onClick={handleLogin}
        >
          Đăng nhập với Google
        </Button>
        <Link
          href={PATH.home}
          className="mt-4 block text-center text-sm text-emerald-300/80 hover:underline"
        >
          ← Về trang khách
        </Link>
      </div>
    </div>
  );
};
