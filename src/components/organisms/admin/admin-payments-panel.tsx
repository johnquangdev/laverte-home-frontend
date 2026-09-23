"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  CheckCircle2,
  MoreVertical,
  QrCode,
  ReceiptText,
  RotateCcw,
  Search,
  SearchX,
} from "lucide-react";
import type { FC } from "react";

import type { MenuItem } from "@/components/atoms/dropdown-menu";
import { DropdownMenu } from "@/components/atoms/dropdown-menu";
import { EmptyState } from "@/components/atoms/empty-state";
import { FilterChip } from "@/components/atoms/filter-chip";
import { Pagination } from "@/components/atoms/pagination";
import { LabeledSpinner } from "@/components/atoms/spinner";
import { StatTile } from "@/components/atoms/stat-tile";
import type { StatusTone } from "@/components/atoms/status-pill";
import { BOOKING_STATUS, StatusPill } from "@/components/atoms/status-pill";
import { AdminDialog } from "@/components/organisms/admin/admin-dialog";
import {
  ADMIN_BTN_DANGER,
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_FIELD,
  AdminField,
  AdminFormError,
} from "@/components/organisms/admin/admin-form";
import { AdminPageHeader } from "@/components/organisms/admin/admin-page-header";
import {
  useRefundPaymentMutation,
  useResolveUnmatchedMutation,
} from "@/hooks/mutations/admin-payment";
import {
  useAdminPaymentsQuery,
  useUnmatchedTransfersQuery,
} from "@/hooks/queries/admin";
import type {
  AdminPaymentEntity,
  PaymentStatus,
  UnmatchedReason,
  UnmatchedTransferEntity,
} from "@/types/api/entities";
import { compactVnd } from "@/utils/chart";
import { cn, formatVnd } from "@/utils/common";

const STATUS: Record<PaymentStatus, { tone: StatusTone; label: string }> = {
  paid: { tone: "paid", label: "Đã thu" },
  pending: { tone: "pending", label: "Chờ chuyển khoản" },
  expired: { tone: "expired", label: "Hết hạn" },
  failed: { tone: "cancelled", label: "Thất bại" },
  refunded: { tone: "checkin", label: "Đã hoàn" },
};

const REASON: Record<UnmatchedReason, string> = {
  no_memo: "Nội dung chuyển khoản không có mã booking",
  booking_not_found: "Mã booking trong nội dung không tồn tại",
  booking_not_pending: "Booking đã hết hạn giữ chỗ hoặc đã huỷ",
  amount_mismatch: "Số tiền không khớp giá booking",
};

const COLS =
  "grid grid-cols-[100px_minmax(160px,1.2fr)_100px_120px_140px_minmax(110px,1fr)_44px] items-center gap-3";

const UNMATCHED_COLS =
  "grid grid-cols-[100px_110px_minmax(180px,1.3fr)_minmax(160px,1fr)_130px_44px] items-center gap-3";

const PAGE_SIZE = 10;

// A paid row whose stay will never happen is money owed back to the guest.
const needsRefund = (p: AdminPaymentEntity) =>
  p.status === "paid" &&
  (p.booking_status === "cancelled" || p.booking_status === "expired");

const ProviderChip: FC<{ provider: AdminPaymentEntity["provider"] }> = ({
  provider,
}) => (
  <span className="text-admin-ink flex items-center gap-2 text-sm">
    <span
      aria-hidden="true"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-[6px] text-[9px] font-bold text-white",
        provider === "sepay" ? "bg-[#0f6fbd]" : "bg-admin-ink"
      )}
    >
      {provider === "sepay" ? "SP" : "TM"}
    </span>
    {provider === "sepay" ? "SePay" : "Tiền mặt"}
  </span>
);

const QrDialog: FC<{ payment: AdminPaymentEntity; onClose: () => void }> = ({
  payment,
  onClose,
}) => (
  <AdminDialog
    open
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
    title={`QR chuyển khoản booking #${payment.booking_id}`}
    description="Gửi lại ảnh này cho khách nếu họ lỡ đóng trang thanh toán. Mã hết hạn cùng lúc với giờ giữ chỗ."
    footer={
      <button type="button" onClick={onClose} className={ADMIN_BTN_SECONDARY}>
        Đóng
      </button>
    }
  >
    <div className="flex flex-col items-center gap-3">
      {payment.qr_content ? (
        // The QR is rendered by the bank-QR service from a URL; there is no
        // local asset for next/image to optimise.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={payment.qr_content}
          alt={`Mã VietQR ${formatVnd(payment.amount)} cho booking #${payment.booking_id}`}
          width={260}
          height={260}
          className="border-admin-line rounded-field size-[260px] border object-contain"
        />
      ) : (
        <p className="text-admin-body text-sm">Giao dịch này không có mã QR.</p>
      )}
      <p className="text-admin-ink text-lg font-semibold tabular-nums">
        {formatVnd(payment.amount)}
      </p>
      <p className="text-admin-body text-sm">
        {payment.customer_name} · {payment.customer_phone}
      </p>
    </div>
  </AdminDialog>
);

type NoteDialogProps = {
  title: string;
  description: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  destructive?: boolean;
  pending: boolean;
  onSubmit: (note: string) => Promise<void>;
  onClose: () => void;
};

/** One free-text note, required: the only record of money moved by hand. */
const NoteDialog: FC<NoteDialogProps> = ({
  title,
  description,
  label,
  placeholder,
  submitLabel,
  destructive,
  pending,
  onSubmit,
  onClose,
}) => {
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState<string>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = async () => {
    if (!note.trim()) {
      setNoteError("Ghi chú là bắt buộc để sau này còn đối chiếu được.");
      document.getElementById("money-note")?.focus();
      return;
    }
    setNoteError(undefined);
    setSubmitError(null);
    try {
      await onSubmit(note.trim());
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Thao tác thất bại"
      );
    }
  };

  return (
    <AdminDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={title}
      description={description}
      onSubmit={() => void submit()}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className={ADMIN_BTN_SECONDARY}
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={pending}
            className={destructive ? ADMIN_BTN_DANGER : ADMIN_BTN_PRIMARY}
          >
            {pending ? "Đang lưu…" : submitLabel}
          </button>
        </>
      }
    >
      <div className="grid gap-4">
        <AdminFormError message={submitError} />
        <AdminField id="money-note" label={label} error={noteError}>
          <textarea
            id="money-note"
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={placeholder}
            rows={3}
            maxLength={500}
            aria-invalid={noteError ? true : undefined}
            aria-describedby={noteError ? "money-note-error" : undefined}
            className={`${ADMIN_FIELD} py-2.5`}
          />
        </AdminField>
      </div>
    </AdminDialog>
  );
};

type PaymentsTabProps = {
  payments: AdminPaymentEntity[];
};

const PaymentsTab: FC<PaymentsTabProps> = ({ payments }) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [providerFilter, setProviderFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [qrFor, setQrFor] = useState<AdminPaymentEntity | null>(null);
  const [refundFor, setRefundFor] = useState<AdminPaymentEntity | null>(null);
  const refund = useRefundPaymentMutation();

  const statusOptions = useMemo(
    () =>
      (Object.keys(STATUS) as PaymentStatus[]).map((value) => ({
        value,
        label: STATUS[value].label,
        count: payments.filter((p) => p.status === value).length,
      })),
    [payments]
  );
  const providerOptions = useMemo(
    () => [
      {
        value: "sepay",
        label: "SePay",
        count: payments.filter((p) => p.provider === "sepay").length,
      },
      {
        value: "cash",
        label: "Tiền mặt",
        count: payments.filter((p) => p.provider === "cash").length,
      },
    ],
    [payments]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter.length && !statusFilter.includes(p.status)) return false;
      if (providerFilter.length && !providerFilter.includes(p.provider))
        return false;
      if (!q) return true;
      return (
        String(p.id).includes(q) ||
        String(p.booking_id).includes(q) ||
        p.customer_name.toLowerCase().includes(q) ||
        p.customer_phone.includes(q) ||
        p.sepay_transaction_ref.toLowerCase().includes(q)
      );
    });
  }, [payments, query, statusFilter, providerFilter]);

  const pageRows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtered =
    query.trim().length > 0 ||
    statusFilter.length > 0 ||
    providerFilter.length > 0;

  const menuFor = (payment: AdminPaymentEntity): MenuItem[] => {
    const items: MenuItem[] = [];
    if (payment.status === "pending" && payment.qr_content) {
      items.push({
        label: "Xem QR chuyển khoản",
        icon: QrCode,
        onSelect: () => setQrFor(payment),
      });
    }
    if (needsRefund(payment)) {
      items.push({
        label: "Ghi nhận đã hoàn tiền",
        icon: RotateCcw,
        destructive: true,
        onSelect: () => setRefundFor(payment),
      });
    }
    return items;
  };

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search
            aria-hidden="true"
            className="text-admin-body pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <label className="sr-only" htmlFor="payment-search">
            Tìm giao dịch
          </label>
          <input
            id="payment-search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Mã, khách, số điện thoại, mã SePay…"
            spellCheck={false}
            autoComplete="off"
            className={cn(ADMIN_FIELD, "min-h-control-md pl-9")}
          />
        </div>
        <FilterChip
          label="Trạng thái"
          options={statusOptions}
          selected={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        />
        <FilterChip
          label="Cổng"
          options={providerOptions}
          selected={providerFilter}
          onChange={(v) => {
            setProviderFilter(v);
            setPage(1);
          }}
        />
        <span className="text-admin-body ml-auto text-sm tabular-nums">
          {visible.length}/{payments.length} giao dịch
        </span>
      </div>

      <div className="border-admin-line rounded-card bg-admin-card overflow-hidden border shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[840px]">
            <div className={`${COLS} bg-admin-page px-4 py-2.5`}>
              {[
                "Giao dịch",
                "Booking",
                "Cổng",
                "Số tiền",
                "Trạng thái",
                "Mã SePay / ghi chú",
              ].map((h) => (
                <span key={h} className="text-admin-body text-xs font-medium">
                  {h}
                </span>
              ))}
              <span className="sr-only">Thao tác</span>
            </div>

            {pageRows.length === 0 ? (
              <div className="border-admin-line border-t">
                <EmptyState
                  icon={filtered ? SearchX : ReceiptText}
                  title={
                    filtered
                      ? "Không có giao dịch nào khớp"
                      : "Chưa có giao dịch trong khoảng này"
                  }
                  description={
                    filtered
                      ? "Thử bỏ bớt bộ lọc hoặc đổi từ khoá."
                      : "Đổi khoảng ngày ở góc trên để xem giai đoạn khác."
                  }
                />
              </div>
            ) : (
              pageRows.map((payment) => {
                const status = STATUS[payment.status] ?? {
                  tone: "expired" as const,
                  label: payment.status,
                };
                const booking = BOOKING_STATUS[payment.booking_status];
                const menu = menuFor(payment);
                return (
                  <div
                    key={payment.id}
                    className={`${COLS} border-admin-line hover:bg-admin-page/60 border-t px-4 py-3 transition-colors`}
                  >
                    <div className="min-w-0">
                      <p className="text-admin-ink text-sm font-medium">
                        #{payment.id}
                      </p>
                      <p className="text-admin-body mt-0.5 text-xs tabular-nums">
                        {dayjs(payment.created_at).format("DD/MM HH:mm")}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-admin-ink truncate text-sm">
                        {payment.customer_name}
                      </p>
                      <p className="text-admin-body mt-0.5 truncate text-xs">
                        Booking #{payment.booking_id}
                        {booking ? ` · ${booking.label}` : ""}
                      </p>
                    </div>

                    <ProviderChip provider={payment.provider} />

                    <p className="text-admin-ink text-sm font-medium tabular-nums">
                      {formatVnd(payment.amount)}
                    </p>

                    <div className="flex flex-col items-start gap-1">
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                      {needsRefund(payment) ? (
                        <span className="text-state-pending-fg text-xs">
                          Cần hoàn tiền
                        </span>
                      ) : null}
                    </div>

                    <p className="text-admin-body min-w-0 truncate text-sm">
                      {payment.status === "refunded"
                        ? payment.refund_note
                        : payment.sepay_transaction_ref || "—"}
                    </p>

                    <div className="flex justify-end">
                      {menu.length > 0 ? (
                        <DropdownMenu
                          label={`Thao tác cho giao dịch #${payment.id}`}
                          trigger={
                            <MoreVertical
                              aria-hidden="true"
                              className="size-4"
                            />
                          }
                          items={menu}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}

            {visible.length > PAGE_SIZE ? (
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                total={visible.length}
                onPageChange={setPage}
              />
            ) : null}
          </div>
        </div>
      </div>

      {qrFor ? (
        <QrDialog payment={qrFor} onClose={() => setQrFor(null)} />
      ) : null}
      {refundFor ? (
        <NoteDialog
          title={`Ghi nhận hoàn ${formatVnd(refundFor.amount)}`}
          description={`Chuyển trả tiền cho ${refundFor.customer_name} qua ngân hàng trước, rồi ghi lại ở đây. Doanh thu sẽ trừ khoản này.`}
          label="Ghi chú hoàn tiền"
          placeholder="Đã CK hoàn về VCB 0123…, mã giao dịch FT…"
          submitLabel="Ghi nhận đã hoàn"
          destructive
          pending={refund.isPending}
          onSubmit={async (note) => {
            await refund.mutateAsync({ paymentId: refundFor.id, note });
          }}
          onClose={() => setRefundFor(null)}
        />
      ) : null}
    </div>
  );
};

const UnmatchedTab: FC<{
  transfers: UnmatchedTransferEntity[];
  showResolved: boolean;
  onShowResolvedChange: (v: boolean) => void;
}> = ({ transfers, showResolved, onShowResolvedChange }) => {
  const [resolving, setResolving] = useState<UnmatchedTransferEntity | null>(
    null
  );
  const resolve = useResolveUnmatchedMutation();

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-admin-body max-w-2xl text-sm">
          Tiền đã vào tài khoản nhưng không xác nhận được booking nào. Hoàn lại
          cho khách hoặc tạo booking tại chỗ, rồi đánh dấu đã xử lý kèm ghi chú.
        </p>
        <label className="min-h-control-md text-admin-body flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => onShowResolvedChange(e.target.checked)}
            className="accent-admin-accent size-4"
          />
          Hiện cả khoản đã xử lý
        </label>
      </div>

      <div className="border-admin-line rounded-card bg-admin-card overflow-hidden border shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[780px]">
            <div className={`${UNMATCHED_COLS} bg-admin-page px-4 py-2.5`}>
              {[
                "Nhận lúc",
                "Số tiền",
                "Nội dung chuyển khoản",
                "Lý do",
                "Trạng thái",
              ].map((h) => (
                <span key={h} className="text-admin-body text-xs font-medium">
                  {h}
                </span>
              ))}
              <span className="sr-only">Thao tác</span>
            </div>

            {transfers.length === 0 ? (
              <div className="border-admin-line border-t">
                <EmptyState
                  icon={CheckCircle2}
                  title="Không có khoản nào cần đối soát"
                  description="Khoản chuyển khoản sai nội dung hoặc sai số tiền sẽ hiện ở đây, kèm email báo admin."
                />
              </div>
            ) : (
              transfers.map((t) => (
                <div
                  key={t.id}
                  className={`${UNMATCHED_COLS} border-admin-line hover:bg-admin-page/60 border-t px-4 py-3 transition-colors`}
                >
                  <p className="text-admin-ink text-sm tabular-nums">
                    {dayjs(t.received_at).format("DD/MM HH:mm")}
                  </p>
                  <p className="text-admin-ink text-sm font-medium tabular-nums">
                    {formatVnd(t.amount)}
                  </p>
                  <div className="min-w-0">
                    <p className="text-admin-ink truncate text-sm">
                      {t.content || "—"}
                    </p>
                    <p className="text-admin-body mt-0.5 truncate text-xs">
                      SePay {t.sepay_transaction_ref}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-admin-ink text-sm">{REASON[t.reason]}</p>
                    {t.booking_ref ? (
                      <p className="text-admin-body mt-0.5 text-xs">
                        Booking #{t.booking_ref}
                      </p>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    {t.resolved_at ? (
                      <>
                        <StatusPill tone="paid">Đã xử lý</StatusPill>
                        <p className="text-admin-body mt-1 truncate text-xs">
                          {t.resolution_note}
                        </p>
                      </>
                    ) : (
                      <StatusPill tone="pending">Chưa xử lý</StatusPill>
                    )}
                  </div>
                  <div className="flex justify-end">
                    {t.resolved_at ? null : (
                      <button
                        type="button"
                        onClick={() => setResolving(t)}
                        aria-label={`Đánh dấu đã xử lý khoản ${formatVnd(t.amount)}`}
                        className="rounded-field text-admin-body hover:text-admin-ink hover:bg-admin-page focus-visible:ring-admin-accent flex size-11 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <CheckCircle2 aria-hidden="true" className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {resolving ? (
        <NoteDialog
          title={`Xử lý khoản ${formatVnd(resolving.amount)}`}
          description={REASON[resolving.reason]}
          label="Đã xử lý thế nào"
          placeholder="Đã hoàn về tài khoản khách… / Đã tạo booking #…"
          submitLabel="Đánh dấu đã xử lý"
          pending={resolve.isPending}
          onSubmit={async (note) => {
            await resolve.mutateAsync({ transferId: resolving.id, note });
          }}
          onClose={() => setResolving(null)}
        />
      ) : null}
    </div>
  );
};

type Tab = "payments" | "unmatched";

export const AdminPaymentsPanel: FC = () => {
  const [tab, setTab] = useState<Tab>("payments");
  // Inclusive days in the UI; the API's `to` is exclusive, hence the +1 below.
  const [fromDay, setFromDay] = useState(() =>
    dayjs().subtract(29, "day").format("YYYY-MM-DD")
  );
  const [toDay, setToDay] = useState(() => dayjs().format("YYYY-MM-DD"));
  const [showResolved, setShowResolved] = useState(false);

  const validRange = !dayjs(toDay).isBefore(dayjs(fromDay));
  const paymentsQuery = useAdminPaymentsQuery(
    fromDay,
    dayjs(validRange ? toDay : fromDay)
      .add(1, "day")
      .format("YYYY-MM-DD")
  );
  const openQuery = useUnmatchedTransfersQuery("open");
  // The open list feeds the tab badge and stat tile, so it always loads; the
  // full history only when someone asks for it.
  const allQuery = useUnmatchedTransfersQuery("all", showResolved);
  const unmatchedQuery = showResolved ? allQuery : openQuery;

  const payments = useMemo(
    () => paymentsQuery.data ?? [],
    [paymentsQuery.data]
  );
  const openTransfers = useMemo(() => openQuery.data ?? [], [openQuery.data]);

  const totals = useMemo(() => {
    const sum = (status: PaymentStatus) =>
      payments
        .filter((p) => p.status === status)
        .reduce((s, p) => s + p.amount, 0);
    return {
      paid: sum("paid"),
      pending: sum("pending"),
      refunded: sum("refunded"),
      owed: payments.filter(needsRefund).length,
      unmatched: openTransfers.length,
      unmatchedAmount: openTransfers.reduce((s, t) => s + t.amount, 0),
    };
  }, [payments, openTransfers]);

  const error = tab === "payments" ? paymentsQuery.error : unmatchedQuery.error;
  const loading =
    tab === "payments" ? paymentsQuery.isLoading : unmatchedQuery.isLoading;

  return (
    <div className="grid gap-5">
      <AdminPageHeader
        title="Giao dịch"
        actions={
          <>
            <label className="flex items-center gap-2">
              <span className="text-admin-body text-sm">Từ</span>
              <input
                type="date"
                value={fromDay}
                onChange={(e) => setFromDay(e.target.value)}
                className={cn(ADMIN_FIELD, "min-h-control-md w-auto")}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-admin-body text-sm">Đến</span>
              <input
                type="date"
                value={toDay}
                min={fromDay}
                onChange={(e) => setToDay(e.target.value)}
                aria-invalid={validRange ? undefined : true}
                className={cn(ADMIN_FIELD, "min-h-control-md w-auto")}
              />
            </label>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Đã thu"
          value={compactVnd(totals.paid)}
          hint={formatVnd(totals.paid)}
        />
        <StatTile
          label="Chờ chuyển khoản"
          value={compactVnd(totals.pending)}
          hint={formatVnd(totals.pending)}
        />
        <StatTile
          label="Cần đối soát"
          value={String(totals.unmatched)}
          hint={
            totals.unmatched > 0
              ? `${formatVnd(totals.unmatchedAmount)} chưa khớp booking`
              : "Không có khoản nào treo"
          }
        />
        <StatTile
          label="Đã hoàn"
          value={compactVnd(totals.refunded)}
          hint={
            totals.owed > 0
              ? `${totals.owed} giao dịch còn chờ hoàn`
              : formatVnd(totals.refunded)
          }
        />
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Chế độ xem"
      >
        {(
          [
            ["payments", "Giao dịch", payments.length],
            ["unmatched", "Cần đối soát", totals.unmatched],
          ] as const
        ).map(([value, label, count]) => (
          <button
            key={value}
            type="button"
            aria-pressed={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "rounded-pill min-h-control-md focus-visible:ring-admin-accent inline-flex items-center gap-2 border px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
              tab === value
                ? "border-admin-ink bg-admin-ink font-medium text-white"
                : "border-admin-line bg-admin-card text-admin-body hover:text-admin-ink"
            )}
          >
            {label}
            <span className="tabular-nums opacity-80">{count}</span>
          </button>
        ))}
      </div>

      {!validRange ? (
        <p className="text-danger-fg text-sm" aria-live="polite">
          Ngày kết thúc phải sau ngày bắt đầu.
        </p>
      ) : null}
      {error ? (
        <p className="text-danger-fg text-sm" aria-live="polite">
          {error.message}
        </p>
      ) : null}

      {loading ? (
        <LabeledSpinner>Đang tải…</LabeledSpinner>
      ) : tab === "payments" ? (
        <PaymentsTab payments={payments} />
      ) : (
        <UnmatchedTab
          transfers={unmatchedQuery.data ?? []}
          showResolved={showResolved}
          onShowResolvedChange={setShowResolved}
        />
      )}
    </div>
  );
};
