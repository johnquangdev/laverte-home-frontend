"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Link2,
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
import { StatTile } from "@/components/atoms/stat-tile";
import type { StatusTone } from "@/components/atoms/status-pill";
import { StatusPill } from "@/components/atoms/status-pill";
import { AdminPageHeader } from "@/components/organisms/admin/admin-page-header";
import { compactVnd } from "@/utils/chart";
import { formatVnd } from "@/utils/common";

type PaymentStatus = "paid" | "pending" | "unmatched" | "expired" | "refunded";

type Payment = {
  id: string;
  bookingId: number | null;
  customer: string | null;
  provider: "sepay" | "cash";
  amount: number;
  status: PaymentStatus;
  ref: string | null;
  memo: string;
  createdAt: string;
};

const STATUS: Record<PaymentStatus, { tone: StatusTone; label: string }> = {
  paid: { tone: "paid", label: "Đã thu" },
  pending: { tone: "pending", label: "Chờ chuyển khoản" },
  unmatched: { tone: "pending", label: "Cần đối soát" },
  expired: { tone: "expired", label: "Hết hạn" },
  refunded: { tone: "cancelled", label: "Đã hoàn" },
};

const M = 1_000_000;

/**
 * Sample rows until GET /admin/payments exists. Shapes follow model.Payment —
 * an unmatched row is a real SePay case: money arrived but the transfer memo
 * did not match any booking, so it has a ref and no booking id.
 */
const SAMPLE: Payment[] = [
  {
    id: "PM-2048",
    bookingId: 141,
    customer: "Trần Minh Anh",
    provider: "sepay",
    amount: 1.9 * M,
    status: "pending",
    ref: null,
    memo: "LAVERTE141",
    createdAt: "2026-09-11T14:05:00",
  },
  {
    id: "PM-2047",
    bookingId: 140,
    customer: "Lê Hoàng Nam",
    provider: "sepay",
    amount: 2.4 * M,
    status: "paid",
    ref: "SP-8842190",
    memo: "LAVERTE140",
    createdAt: "2026-09-11T13:38:00",
  },
  {
    id: "PM-2046",
    bookingId: null,
    customer: null,
    provider: "sepay",
    amount: 980_000,
    status: "unmatched",
    ref: "SP-8842155",
    memo: "CK TU NGUYEN VAN A",
    createdAt: "2026-09-11T11:02:00",
  },
  {
    id: "PM-2045",
    bookingId: 139,
    customer: "Nguyễn Thảo Vy",
    provider: "cash",
    amount: 1.25 * M,
    status: "paid",
    ref: null,
    memo: "Thu tại chỗ",
    createdAt: "2026-09-10T20:44:00",
  },
  {
    id: "PM-2044",
    bookingId: 138,
    customer: "Phạm Thu Hà",
    provider: "sepay",
    amount: 1.75 * M,
    status: "expired",
    ref: null,
    memo: "LAVERTE138",
    createdAt: "2026-09-10T19:12:00",
  },
  {
    id: "PM-2043",
    bookingId: 137,
    customer: "Đỗ Quang Huy",
    provider: "sepay",
    amount: 3.2 * M,
    status: "paid",
    ref: "SP-8841902",
    createdAt: "2026-09-10T16:30:00",
    memo: "LAVERTE137",
  },
  {
    id: "PM-2042",
    bookingId: 136,
    customer: "Vũ Hà My",
    provider: "sepay",
    amount: 2.1 * M,
    status: "refunded",
    ref: "SP-8841755",
    memo: "LAVERTE136",
    createdAt: "2026-09-09T09:20:00",
  },
  {
    id: "PM-2041",
    bookingId: 135,
    customer: "Bùi Anh Khoa",
    provider: "sepay",
    amount: 1.45 * M,
    status: "paid",
    ref: "SP-8841600",
    memo: "LAVERTE135",
    createdAt: "2026-09-09T08:05:00",
  },
];

const COLS =
  "grid grid-cols-[160px_minmax(190px,1.2fr)_130px_140px_170px_minmax(170px,1fr)_64px] items-center gap-4";

const FIELD =
  "border-admin-field rounded-field text-admin-ink focus-visible:ring-admin-accent border px-3 focus-visible:ring-2 focus-visible:outline-none";

const PAGE_SIZE = 5;

const ProviderChip: FC<{ provider: Payment["provider"] }> = ({ provider }) =>
  provider === "sepay" ? (
    <span className="text-admin-ink flex items-center gap-2 text-sm">
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[#0f6fbd] text-[9px] font-bold text-white"
      >
        SP
      </span>
      SePay
    </span>
  ) : (
    <span className="text-admin-ink flex items-center gap-2 text-sm">
      <span
        aria-hidden="true"
        className="bg-admin-ink flex size-6 shrink-0 items-center justify-center rounded-[6px] text-[9px] font-bold text-white"
      >
        TM
      </span>
      Tiền mặt
    </span>
  );

export const AdminPaymentsPanel: FC = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [providerFilter, setProviderFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const statusOptions = useMemo(
    () =>
      (Object.keys(STATUS) as PaymentStatus[]).map((value) => ({
        value,
        label: STATUS[value].label,
        count: SAMPLE.filter((p) => p.status === value).length,
      })),
    []
  );

  const providerOptions = [
    {
      value: "sepay",
      label: "SePay",
      count: SAMPLE.filter((p) => p.provider === "sepay").length,
    },
    {
      value: "cash",
      label: "Tiền mặt",
      count: SAMPLE.filter((p) => p.provider === "cash").length,
    },
  ];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE.filter((p) => {
      if (statusFilter.length && !statusFilter.includes(p.status)) return false;
      if (providerFilter.length && !providerFilter.includes(p.provider))
        return false;
      if (!q) return true;
      return (
        p.id.toLowerCase().includes(q) ||
        (p.customer?.toLowerCase().includes(q) ?? false) ||
        (p.ref?.toLowerCase().includes(q) ?? false) ||
        String(p.bookingId ?? "").includes(q)
      );
    });
  }, [query, statusFilter, providerFilter]);

  const pageRows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtered =
    query.trim().length > 0 ||
    statusFilter.length > 0 ||
    providerFilter.length > 0;

  const totals = useMemo(
    () => ({
      paid: SAMPLE.filter((p) => p.status === "paid").reduce(
        (s, p) => s + p.amount,
        0
      ),
      pending: SAMPLE.filter((p) => p.status === "pending").reduce(
        (s, p) => s + p.amount,
        0
      ),
      unmatched: SAMPLE.filter((p) => p.status === "unmatched").length,
      refunded: SAMPLE.filter((p) => p.status === "refunded").reduce(
        (s, p) => s + p.amount,
        0
      ),
    }),
    []
  );

  const menuFor = (payment: Payment): MenuItem[] => {
    const items: MenuItem[] = [];
    if (payment.status === "pending") {
      items.push({
        label: "Xem QR chuyển khoản",
        icon: QrCode,
        onSelect: () => undefined,
      });
    }
    if (payment.status === "unmatched") {
      items.push({
        label: "Gán vào booking",
        icon: Link2,
        onSelect: () => undefined,
      });
    }
    if (payment.status === "paid") {
      items.push({
        label: "Hoàn tiền",
        icon: RotateCcw,
        destructive: true,
        onSelect: () => undefined,
      });
    }
    return items;
  };

  return (
    <div className="grid gap-5">
      <AdminPageHeader
        title="Giao dịch"
        actions={
          <span className="border-admin-line text-admin-body rounded-pill border px-2.5 py-1 text-[10px] font-medium">
            dữ liệu mẫu
          </span>
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
          hint="Hết hạn giữ chỗ sau 15 phút"
        />
        <StatTile
          label="Cần đối soát"
          value={String(totals.unmatched)}
          hint="Tiền về nhưng nội dung CK không khớp"
        />
        <StatTile
          label="Đã hoàn"
          value={compactVnd(totals.refunded)}
          hint={formatVnd(totals.refunded)}
        />
      </div>

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
            placeholder="Mã giao dịch, khách, mã SePay…"
            spellCheck={false}
            className={`${FIELD} min-h-control-md w-full pl-9 text-base`}
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
          {visible.length}/{SAMPLE.length} giao dịch
        </span>
      </div>

      <div className="border-admin-line rounded-card bg-admin-card overflow-hidden border shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[1080px]">
            <div className={`${COLS} bg-admin-page px-4 py-2.5`}>
              {[
                "Giao dịch",
                "Booking",
                "Cổng",
                "Số tiền",
                "Trạng thái",
                "Mã SePay",
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
                      : "Chưa có giao dịch"
                  }
                  description={
                    filtered ? "Thử bỏ bớt bộ lọc hoặc đổi từ khoá." : undefined
                  }
                />
              </div>
            ) : (
              pageRows.map((payment) => {
                const status = STATUS[payment.status];
                const menu = menuFor(payment);
                return (
                  <div
                    key={payment.id}
                    className="border-admin-line hover:bg-admin-page/60 border-t transition-colors"
                  >
                    <div className={`${COLS} px-4 py-3`}>
                      <div className="min-w-0">
                        <p className="text-admin-ink text-sm font-medium">
                          #{payment.id}
                        </p>
                        <p className="text-admin-body mt-0.5 text-xs tabular-nums">
                          {dayjs(payment.createdAt).format("DD/MM HH:mm")}
                        </p>
                      </div>

                      <div className="min-w-0">
                        {payment.bookingId ? (
                          <>
                            <p className="text-admin-ink truncate text-sm">
                              {payment.customer}
                            </p>
                            <p className="text-admin-body mt-0.5 text-xs">
                              Booking #{payment.bookingId}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-admin-body text-sm">
                              Chưa khớp booking
                            </p>
                            <p className="text-state-pending-fg mt-0.5 truncate text-xs">
                              {payment.memo}
                            </p>
                          </>
                        )}
                      </div>

                      <ProviderChip provider={payment.provider} />

                      <p className="text-admin-ink text-sm font-medium tabular-nums">
                        {formatVnd(payment.amount)}
                      </p>

                      <StatusPill tone={status.tone}>{status.label}</StatusPill>

                      <p className="text-admin-body min-w-0 truncate text-sm">
                        {payment.ref ?? (
                          <span className="text-admin-body/70">
                            CK: {payment.memo}
                          </span>
                        )}
                      </p>

                      <div className="flex justify-end">
                        {menu.length > 0 ? (
                          <DropdownMenu
                            label={`Thao tác cho giao dịch ${payment.id}`}
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

      <p className="text-admin-body max-w-3xl text-xs leading-relaxed">
        Toàn bộ màn này chạy bằng số mẫu. Cần <code>GET /admin/payments</code>,{" "}
        <code>POST /admin/payments/:id/refund</code> và{" "}
        <code>POST /admin/payments/:id/assign-booking</code>; riêng hoàn tiền
        còn cần thêm trạng thái <code>refunded</code> vào{" "}
        <code>model.Payment</code>, hiện chỉ có pending, paid, expired và
        failed.
      </p>
    </div>
  );
};
