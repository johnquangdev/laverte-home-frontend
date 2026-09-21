"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Ban,
  CalendarX2,
  CheckCircle2,
  KeyRound,
  MoreVertical,
  Search,
  SearchX,
  Send,
  UserX,
} from "lucide-react";
import type { FC } from "react";

import type { MenuItem } from "@/components/atoms/dropdown-menu";
import { DropdownMenu } from "@/components/atoms/dropdown-menu";
import { EmptyState } from "@/components/atoms/empty-state";
import { FilterChip } from "@/components/atoms/filter-chip";
import { LabeledSpinner } from "@/components/atoms/spinner";
import { StatTile } from "@/components/atoms/stat-tile";
import { BOOKING_STATUS, StatusPill } from "@/components/atoms/status-pill";
import { AdminPageHeader } from "@/components/organisms/admin/admin-page-header";
import {
  useCancelBookingMutation,
  useCompleteBookingMutation,
  useNoShowBookingMutation,
  useSendLockCodeMutation,
  useSetLockCodeMutation,
} from "@/hooks/mutations/admin-booking";
import {
  useAdminBookingsQuery,
  useAdminHomesQuery,
} from "@/hooks/queries/admin";
import type {
  AdminBookingEntity,
  BookingStatus,
  BookingType,
} from "@/types/api/entities";
import { formatVnd } from "@/utils/common";

const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  hourly: "Theo giờ",
  overnight: "Qua đêm",
  day: "Theo ngày",
};

// One template shared by header and rows so columns can never drift apart.
const COLS =
  "grid grid-cols-[minmax(200px,1.2fr)_150px_190px_130px_150px_210px_64px] items-center gap-4";

const FIELD =
  "border-admin-field rounded-field text-admin-ink focus-visible:ring-admin-accent border px-3 focus-visible:ring-2 focus-visible:outline-none";

const MICRO_BTN =
  "rounded-pill min-h-control-sm focus-visible:ring-admin-accent inline-flex items-center justify-center border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50";

type RowProps = {
  booking: AdminBookingEntity;
  homeName: string;
};

const BookingRow: FC<RowProps> = ({ booking, homeName }) => {
  const [lockCode, setLockCode] = useState(booking.door_lock_code ?? "");
  const [actionError, setActionError] = useState<string | null>(null);

  const cancelBooking = useCancelBookingMutation();
  const completeBooking = useCompleteBookingMutation();
  const noShowBooking = useNoShowBookingMutation();
  const setLockCodeMutation = useSetLockCodeMutation();
  const sendLockCode = useSendLockCodeMutation();

  const isBusy =
    cancelBooking.isPending ||
    completeBooking.isPending ||
    noShowBooking.isPending ||
    setLockCodeMutation.isPending ||
    sendLockCode.isPending;

  const runAction = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Thao tác thất bại"
      );
    }
  };

  const status = BOOKING_STATUS[booking.status] ?? {
    tone: "expired" as const,
    label: booking.status,
  };

  const menuItems: MenuItem[] = [];
  if (booking.status === "confirmed") {
    menuItems.push(
      {
        label: "Đánh dấu hoàn thành",
        icon: CheckCircle2,
        disabled: isBusy,
        onSelect: () =>
          runAction(async () => {
            await completeBooking.mutateAsync(booking.id);
          }),
      },
      {
        label: "Khách không đến",
        icon: UserX,
        disabled: isBusy,
        onSelect: () =>
          runAction(async () => {
            await noShowBooking.mutateAsync(booking.id);
          }),
      }
    );
  }
  if (booking.status === "pending_payment" || booking.status === "confirmed") {
    menuItems.push({
      label: "Huỷ booking",
      icon: Ban,
      destructive: true,
      disabled: isBusy,
      onSelect: () =>
        runAction(async () => {
          await cancelBooking.mutateAsync(booking.id);
        }),
    });
  }

  return (
    <div className="border-admin-line hover:bg-admin-page/60 border-t transition-colors">
      <div className={`${COLS} px-4 py-3`}>
        <div className="min-w-0">
          <p className="text-admin-ink truncate text-sm font-medium">
            {booking.customer_name}
          </p>
          <p className="text-admin-body mt-0.5 text-xs">
            #{booking.id} · {booking.customer_phone}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-admin-ink truncate text-sm">{homeName}</p>
          <p className="text-admin-body mt-0.5 text-xs">
            {BOOKING_TYPE_LABELS[booking.booking_type] ?? booking.booking_type}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-admin-ink text-sm tabular-nums">
            {dayjs(booking.start_time).format("DD/MM HH:mm")} →{" "}
            {dayjs(booking.end_time).format("HH:mm")}
          </p>
          <p className="text-admin-body mt-0.5 text-xs">
            {dayjs(booking.end_time).diff(dayjs(booking.start_time), "hour")}h
          </p>
        </div>

        <p className="text-admin-ink text-sm font-medium tabular-nums">
          {formatVnd(booking.computed_price)}
        </p>

        <StatusPill tone={status.tone}>{status.label}</StatusPill>

        <div className="min-w-0">
          {booking.status === "confirmed" ? (
            <div className="flex items-center gap-1.5">
              <label className="sr-only" htmlFor={`lock-${booking.id}`}>
                Mã cửa booking #{booking.id}
              </label>
              <div className="relative">
                <KeyRound
                  aria-hidden="true"
                  className="text-admin-body pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
                />
                <input
                  id={`lock-${booking.id}`}
                  value={lockCode}
                  onChange={(e) => setLockCode(e.target.value)}
                  placeholder="Mã cửa…"
                  inputMode="numeric"
                  spellCheck={false}
                  className={`${FIELD} min-h-control-sm w-28 pl-7 text-sm`}
                />
              </div>
              <button
                type="button"
                className={`${MICRO_BTN} border-admin-field text-admin-body hover:text-admin-ink`}
                disabled={isBusy || !lockCode.trim()}
                onClick={() =>
                  runAction(async () => {
                    await setLockCodeMutation.mutateAsync({
                      bookingId: booking.id,
                      code: lockCode.trim(),
                    });
                  })
                }
              >
                Lưu
              </button>
              <button
                type="button"
                aria-label="Gửi mã cửa qua Zalo"
                className={`${MICRO_BTN} border-admin-accent bg-admin-accent gap-1.5 text-white`}
                disabled={
                  isBusy || !(booking.door_lock_code || lockCode.trim())
                }
                onClick={() =>
                  runAction(async () => {
                    await sendLockCode.mutateAsync(booking.id);
                  })
                }
              >
                <Send aria-hidden="true" className="size-3" />
                Zalo
              </button>
            </div>
          ) : booking.door_lock_code ? (
            <p className="text-admin-ink text-sm tabular-nums">
              {booking.door_lock_code}
            </p>
          ) : (
            <p className="text-admin-body text-sm">—</p>
          )}
          {booking.lock_code_sent_at ? (
            <p className="text-state-paid-fg mt-1 text-xs">
              Đã gửi {dayjs(booking.lock_code_sent_at).format("DD/MM HH:mm")}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end">
          {menuItems.length > 0 ? (
            <DropdownMenu
              label={`Thao tác cho booking #${booking.id}`}
              trigger={<MoreVertical aria-hidden="true" className="size-4" />}
              items={menuItems}
            />
          ) : null}
        </div>
      </div>

      {actionError ? (
        <p className="text-danger-fg px-4 pb-3 text-xs" aria-live="polite">
          {actionError}
        </p>
      ) : null}
    </div>
  );
};

export const AdminBookingsPanel: FC = () => {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [homeId, setHomeId] = useState<number | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const homesQuery = useAdminHomesQuery();
  const bookingsQuery = useAdminBookingsQuery(date, homeId, homesQuery.data);

  const homesById = useMemo(() => {
    const map = new Map<number, string>();
    for (const home of homesQuery.data ?? []) {
      map.set(home.id, home.name);
    }
    return map;
  }, [homesQuery.data]);

  // Memoised because the `?? []` fallback is a fresh array each render, which
  // would invalidate every useMemo below it.
  const bookings = useMemo(
    () => bookingsQuery.data ?? [],
    [bookingsQuery.data]
  );

  // Counts come from the unfiltered day so a chip never hides its own options.
  const statusOptions = useMemo(
    () =>
      (Object.keys(BOOKING_STATUS) as BookingStatus[]).map((value) => ({
        value,
        label: BOOKING_STATUS[value].label,
        count: bookings.filter((b) => b.status === value).length,
      })),
    [bookings]
  );

  const typeOptions = useMemo(
    () =>
      (Object.keys(BOOKING_TYPE_LABELS) as BookingType[]).map((value) => ({
        value,
        label: BOOKING_TYPE_LABELS[value],
        count: bookings.filter((b) => b.booking_type === value).length,
      })),
    [bookings]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter.length && !statusFilter.includes(b.status)) return false;
      if (typeFilter.length && !typeFilter.includes(b.booking_type))
        return false;
      if (!q) return true;
      return (
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_phone.includes(q) ||
        String(b.id).includes(q)
      );
    });
  }, [bookings, query, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const dead = new Set(["cancelled", "expired"]);
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      pending: bookings.filter((b) => b.status === "pending_payment").length,
      value: bookings
        .filter((b) => !dead.has(b.status))
        .reduce((sum, b) => sum + b.computed_price, 0),
    };
  }, [bookings]);

  const isLoading = homesQuery.isLoading || bookingsQuery.isLoading;
  const error = homesQuery.error ?? bookingsQuery.error;
  const noHomes = (homesQuery.data ?? []).length === 0;
  const filtered =
    query.trim().length > 0 || statusFilter.length > 0 || typeFilter.length > 0;

  return (
    <div className="grid gap-5">
      <AdminPageHeader
        title="Lịch đặt phòng"
        actions={
          <>
            <label className="flex items-center gap-2">
              <span className="text-admin-body text-sm">Ngày</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${FIELD} min-h-control-md text-base`}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-admin-body text-sm">Phòng</span>
              <select
                value={homeId ?? ""}
                onChange={(e) =>
                  setHomeId(e.target.value ? Number(e.target.value) : undefined)
                }
                className={`${FIELD} min-h-control-md bg-admin-card text-base`}
              >
                <option value="">Tất cả</option>
                {(homesQuery.data ?? []).map((home) => (
                  <option key={home.id} value={home.id}>
                    {home.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Booking trong ngày" value={String(stats.total)} />
        <StatTile label="Đã xác nhận" value={String(stats.confirmed)} />
        <StatTile label="Chờ thanh toán" value={String(stats.pending)} />
        <StatTile label="Giá trị trong ngày" value={formatVnd(stats.value)} />
      </div>

      {/* One filter row above the table: search plus chips, all scoping the
          same slice. */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search
            aria-hidden="true"
            className="text-admin-body pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <label className="sr-only" htmlFor="booking-search">
            Tìm booking
          </label>
          <input
            id="booking-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên khách, số điện thoại, mã booking…"
            spellCheck={false}
            className={`${FIELD} min-h-control-md w-full pl-9 text-base`}
          />
        </div>

        <FilterChip
          label="Trạng thái"
          options={statusOptions}
          selected={statusFilter}
          onChange={setStatusFilter}
        />
        <FilterChip
          label="Loại booking"
          options={typeOptions}
          selected={typeFilter}
          onChange={setTypeFilter}
        />

        {filtered ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatusFilter([]);
              setTypeFilter([]);
            }}
            className="text-admin-body hover:text-admin-ink focus-visible:ring-admin-accent min-h-control-sm rounded-pill px-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Xoá lọc
          </button>
        ) : null}

        <span className="text-admin-body ml-auto text-sm tabular-nums">
          {visible.length}/{bookings.length} booking
        </span>
      </div>

      {error ? (
        <p className="text-danger-fg text-sm" aria-live="polite">
          {error.message}
        </p>
      ) : null}

      {isLoading ? (
        <LabeledSpinner>Đang tải…</LabeledSpinner>
      ) : noHomes ? (
        <div className="border-admin-line rounded-card border">
          <EmptyState
            icon={CalendarX2}
            title="Chưa có phòng nào"
            description="Tạo phòng trong màn Phòng trước, lịch đặt sẽ hiện ở đây."
          />
        </div>
      ) : (
        <div className="border-admin-line rounded-card bg-admin-card overflow-hidden border shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
          {/* The table is the one element allowed to be wider than the panel;
              it scrolls inside its own container so the page never does. */}
          <div className="overflow-x-auto">
            <div className="min-w-[1120px]">
              <div className={`${COLS} bg-admin-page px-4 py-2.5`}>
                {[
                  "Khách",
                  "Phòng",
                  "Thời gian",
                  "Số tiền",
                  "Trạng thái",
                  "Mã cửa",
                ].map((h) => (
                  <span key={h} className="text-admin-body text-xs font-medium">
                    {h}
                  </span>
                ))}
                <span className="sr-only">Thao tác</span>
              </div>

              {visible.length === 0 ? (
                <div className="border-admin-line border-t">
                  <EmptyState
                    icon={filtered ? SearchX : CalendarX2}
                    title={
                      filtered
                        ? "Không có booking nào khớp"
                        : "Không có booking trong ngày này"
                    }
                    description={
                      filtered
                        ? "Thử bỏ bớt bộ lọc hoặc đổi từ khoá."
                        : "Chọn ngày khác ở góc trên để xem lịch của hôm đó."
                    }
                    action={
                      filtered ? (
                        <button
                          type="button"
                          onClick={() => {
                            setQuery("");
                            setStatusFilter([]);
                            setTypeFilter([]);
                          }}
                          className={`${MICRO_BTN} border-admin-field text-admin-ink`}
                        >
                          Xoá lọc
                        </button>
                      ) : null
                    }
                  />
                </div>
              ) : (
                visible.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    homeName={
                      homesById.get(booking.home_id) ??
                      `Home ${booking.home_id}`
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
