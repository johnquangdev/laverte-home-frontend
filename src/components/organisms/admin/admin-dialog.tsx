"use client";

import { X } from "lucide-react";
import type { FC, FormEvent, ReactNode } from "react";

import {
  ADMIN_BTN_DANGER,
  ADMIN_BTN_SECONDARY,
} from "@/components/organisms/admin/admin-form";
import * as DialogPrimitive from "@radix-ui/react-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Wraps body and footer in a <form>, so Enter and a submit button in the footer work. */
  onSubmit?: () => void;
};

const BODY =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6";
const FOOTER =
  "border-admin-line flex shrink-0 flex-wrap justify-end gap-2 border-t px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6";

/**
 * The shared dialog is styled for the guest palette. This one keeps the admin
 * tokens and follows the overlay rules: sized in svh so the mobile address bar
 * cannot push the header off-screen, header and footer pinned, body the only
 * scroller.
 */
export const AdminDialog: FC<Props> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  onSubmit,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className="border-admin-line bg-admin-card rounded-card fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100svh-2rem)] w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overscroll-contain border shadow-xl"
          {...(description ? {} : { "aria-describedby": undefined })}
        >
          <div className="border-admin-line flex shrink-0 items-start justify-between gap-4 border-b py-2 pr-2 pl-5 sm:pl-6">
            <div className="min-w-0 py-2.5">
              <DialogPrimitive.Title className="text-admin-ink text-base font-semibold text-balance">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="text-admin-body mt-1 text-sm text-pretty">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close
              aria-label="Đóng"
              className="rounded-field text-admin-body hover:text-admin-ink hover:bg-admin-page focus-visible:ring-admin-accent flex size-11 shrink-0 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <X aria-hidden="true" className="size-5" />
            </DialogPrimitive.Close>
          </div>

          {onSubmit ? (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className={BODY}>{children}</div>
              {footer ? <div className={FOOTER}>{footer}</div> : null}
            </form>
          ) : (
            <>
              <div className={BODY}>{children}</div>
              {footer ? <div className={FOOTER}>{footer}</div> : null}
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

type ConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  pending: boolean;
  error: string | null;
  onConfirm: () => void;
};

export const AdminConfirmDialog: FC<ConfirmProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  pending,
  error,
  onConfirm,
}) => (
  <AdminDialog
    open={open}
    onOpenChange={onOpenChange}
    title={title}
    description={description}
    footer={
      <>
        <DialogPrimitive.Close className={ADMIN_BTN_SECONDARY}>
          Giữ lại
        </DialogPrimitive.Close>
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className={ADMIN_BTN_DANGER}
        >
          {pending ? "Đang xử lý…" : confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-danger-fg min-h-5 text-sm" aria-live="polite">
      {error}
    </p>
  </AdminDialog>
);
