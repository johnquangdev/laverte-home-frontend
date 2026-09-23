"use client";

import { useState } from "react";
import axios from "axios";
import { ShieldAlert, ShieldCheck, UserMinus } from "lucide-react";
import type { FC } from "react";

import { EmptyState } from "@/components/atoms/empty-state";
import { LabeledSpinner } from "@/components/atoms/spinner";
import { AdminConfirmDialog } from "@/components/organisms/admin/admin-dialog";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_FIELD,
  AdminField,
} from "@/components/organisms/admin/admin-form";
import { AdminPageHeader } from "@/components/organisms/admin/admin-page-header";
import {
  useGrantAdminMutation,
  useRevokeAdminMutation,
} from "@/hooks/mutations/admin-roster";
import { useAdminsQuery } from "@/hooks/queries/admin";
import type { AdminListItemEntity } from "@/types/api/entities";

const isForbidden = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 403;

const GrantForm: FC = () => {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string>();
  const [notice, setNotice] = useState<string | null>(null);
  const grant = useGrantAdminMutation();

  const submit = async () => {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldError(
        "Nhập email Google của người cần cấp quyền, ví dụ ten@gmail.com."
      );
      document.getElementById("grant-email")?.focus();
      return;
    }
    setFieldError(undefined);
    setNotice(null);
    try {
      await grant.mutateAsync(value);
      setNotice(`Đã cấp quyền admin cho ${value}.`);
      setEmail("");
    } catch (error) {
      setFieldError(
        error instanceof Error ? error.message : "Cấp quyền thất bại"
      );
    }
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="border-admin-line rounded-card bg-admin-card grid gap-3 border p-4 shadow-[0_1px_2px_rgba(23,23,23,0.04)]"
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 sm:max-w-md">
          <AdminField
            id="grant-email"
            label="Cấp quyền admin"
            hint="Người đó cần đăng nhập bằng Google một lần trước, rồi báo email đã dùng."
            error={fieldError}
          >
            <input
              id="grant-email"
              name="email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@gmail.com…"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={fieldError ? true : undefined}
              aria-describedby={
                fieldError ? "grant-email-error" : "grant-email-hint"
              }
              className={ADMIN_FIELD}
            />
          </AdminField>
        </div>
        <button
          type="submit"
          disabled={grant.isPending}
          className={ADMIN_BTN_PRIMARY}
        >
          <ShieldCheck aria-hidden="true" className="size-4" />
          {grant.isPending ? "Đang cấp…" : "Cấp quyền"}
        </button>
      </div>
      <p className="text-state-paid-fg text-sm empty:hidden" aria-live="polite">
        {notice}
      </p>
    </form>
  );
};

export const AdminAdminsPanel: FC = () => {
  const adminsQuery = useAdminsQuery();
  const revoke = useRevokeAdminMutation();
  const [revoking, setRevoking] = useState<AdminListItemEntity | null>(null);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const confirmRevoke = async () => {
    if (!revoking) return;
    setRevokeError(null);
    try {
      await revoke.mutateAsync(revoking.id);
      setRevoking(null);
    } catch (error) {
      setRevokeError(
        error instanceof Error ? error.message : "Thu hồi thất bại"
      );
    }
  };

  if (adminsQuery.isLoading) {
    return (
      <div className="grid gap-5">
        <AdminPageHeader title="Quản trị viên" />
        <LabeledSpinner>Đang tải…</LabeledSpinner>
      </div>
    );
  }

  if (isForbidden(adminsQuery.error)) {
    return (
      <div className="grid gap-5">
        <AdminPageHeader title="Quản trị viên" />
        <div className="border-admin-line rounded-card border">
          <EmptyState
            icon={ShieldAlert}
            title="Chỉ superadmin quản lý được quản trị viên"
            description="Superadmin là các tài khoản khai báo trong ADMIN_USER_IDS của máy chủ."
          />
        </div>
      </div>
    );
  }

  const admins = adminsQuery.data ?? [];

  return (
    <div className="grid gap-5">
      <AdminPageHeader title="Quản trị viên" />

      {adminsQuery.error ? (
        <p className="text-danger-fg text-sm" aria-live="polite">
          {adminsQuery.error.message}
        </p>
      ) : null}

      <GrantForm />

      <section
        aria-label="Danh sách quản trị viên"
        className="border-admin-line rounded-card bg-admin-card overflow-hidden border shadow-[0_1px_2px_rgba(23,23,23,0.04)]"
      >
        <p className="text-admin-body bg-admin-page border-admin-line border-b px-4 py-2.5 text-xs font-medium">
          Admin được cấp quyền · superadmin khai báo trên máy chủ không hiện ở
          đây
        </p>
        {admins.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Chưa cấp quyền admin cho ai"
            description="Cấp quyền bằng email ở ô phía trên."
          />
        ) : (
          <ul className="divide-admin-line divide-y">
            {admins.map((admin) => (
              <li
                key={admin.id}
                className="flex items-center justify-between gap-3 px-4 py-2"
              >
                <div className="min-w-0">
                  <p className="text-admin-ink truncate text-sm">
                    {admin.email}
                  </p>
                  <p className="text-admin-body text-xs">#{admin.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRevokeError(null);
                    setRevoking(admin);
                  }}
                  aria-label={`Thu hồi quyền admin của ${admin.email}`}
                  className="rounded-field text-admin-body hover:text-danger-fg hover:bg-state-cancelled focus-visible:ring-admin-accent flex size-11 shrink-0 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <UserMinus aria-hidden="true" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AdminConfirmDialog
        open={revoking !== null}
        onOpenChange={(open) => {
          if (!open) setRevoking(null);
        }}
        title="Thu hồi quyền admin?"
        description={
          revoking
            ? `${revoking.email} sẽ mất quyền vào trang quản trị ngay lập tức.`
            : ""
        }
        confirmLabel="Thu hồi"
        pending={revoke.isPending}
        error={revokeError}
        onConfirm={() => void confirmRevoke()}
      />
    </div>
  );
};
