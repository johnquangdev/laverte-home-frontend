"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FC } from "react";

import { Spinner } from "@/components/atoms/spinner";
import { PATH } from "@/constants/path";
import { useGoogleCallbackMutation } from "@/hooks/mutations/booking";
import { useAuthStore } from "@/stores/auth";

export const AdminCallbackHandler: FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const callback = useGoogleCallbackMutation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state) {
      setError("Thiếu mã xác thực từ Google.");
      return;
    }

    void (async () => {
      try {
        const session = await callback.mutateAsync({ code, state });
        setSession(session);
        router.replace(PATH.admin.bookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for OAuth redirect params
  }, [params, router, setSession]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071612] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-emerald-900/40 bg-[#0a1f18] p-6 text-center text-emerald-50">
        {!error ? <Spinner className="mx-auto" /> : null}
        <p className="mt-4 text-sm">{error ?? "Đang xác thực…"}</p>
      </div>
    </div>
  );
};
