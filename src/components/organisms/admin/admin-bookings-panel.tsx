"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { FC } from "react";

import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { LabeledSpinner } from "@/components/atoms/spinner";
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
import type { AdminBookingEntity, BookingStatus } from "@/types/api/entities";
import { formatVnd } from "@/utils/common";

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending_payment: "Chờ thanh toán",
  confirmed: "Đã xác nhận",
  cancelled: "Đã huỷ",
  expired: "Hết hạn",
  completed: "Hoàn thành",
  no_show: "Không đến",
};

type BookingCardProps = {
  booking: AdminBookingEntity;
  homeName: string;
};

const BookingCard: FC<BookingCardProps> = ({ booking, homeName }) => {
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

  return (
    <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-emerald-950">
        #{booking.id} · {booking.customer_name}
      </h2>
      <p className="mt-1 text-sm text-emerald-800/80">
        {homeName} · {STATUS_LABELS[booking.status] ?? booking.status} ·{" "}
        {formatVnd(booking.computed_price)}
      </p>
      <p className="mt-2 text-sm text-emerald-900/80">
        {dayjs(booking.start_time).format("DD/MM/YYYY HH:mm")} →{" "}
        {dayjs(booking.end_time).format("DD/MM/YYYY HH:mm")}
      </p>
      <p className="mt-1 text-sm">{booking.customer_phone}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {booking.status === "pending_payment" ||
        booking.status === "confirmed" ? (
          <Button
            type="button"
            variant="outline"
            shape="pill"
            loading={cancelBooking.isPending}
            disabled={isBusy}
            onClick={() =>
              runAction(async () => {
                await cancelBooking.mutateAsync(booking.id);
              })
            }
          >
            Huỷ
          </Button>
        ) : null}
        {booking.status === "confirmed" ? (
          <>
            <Button
              type="button"
              variant="secondary"
              shape="pill"
              loading={completeBooking.isPending}
              disabled={isBusy}
              onClick={() =>
                runAction(async () => {
                  await completeBooking.mutateAsync(booking.id);
                })
              }
            >
              Hoàn thành
            </Button>
            <Button
              type="button"
              variant="outline"
              shape="pill"
              loading={noShowBooking.isPending}
              disabled={isBusy}
              onClick={() =>
                runAction(async () => {
                  await noShowBooking.mutateAsync(booking.id);
                })
              }
            >
              Không đến
            </Button>
          </>
        ) : null}
      </div>

      {booking.status === "confirmed" ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <input
            value={lockCode}
            onChange={(e) => setLockCode(e.target.value)}
            placeholder="Mã cửa"
            className="rounded-lg border border-emerald-200 px-3 py-2 text-sm"
          />
          <Button
            type="button"
            variant="outline"
            shape="pill"
            loading={setLockCodeMutation.isPending}
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
            Lưu mã
          </Button>
          <Button
            type="button"
            variant="secondary"
            shape="pill"
            loading={sendLockCode.isPending}
            disabled={isBusy || !(booking.door_lock_code || lockCode.trim())}
            onClick={() =>
              runAction(async () => {
                await sendLockCode.mutateAsync(booking.id);
              })
            }
          >
            Gửi Zalo
          </Button>
        </div>
      ) : null}

      {booking.door_lock_code ? (
        <p className="mt-2 font-medium text-emerald-950">
          Mã cửa: {booking.door_lock_code}
        </p>
      ) : null}
      {actionError ? (
        <p className="mt-2 text-sm text-red-600">{actionError}</p>
      ) : null}
    </article>
  );
};

export const AdminBookingsPanel: FC = () => {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [homeId, setHomeId] = useState<number | undefined>(undefined);

  const homesQuery = useAdminHomesQuery();
  const bookingsQuery = useAdminBookingsQuery(date, homeId, homesQuery.data);

  const homesById = useMemo(() => {
    const map = new Map<number, string>();
    for (const home of homesQuery.data ?? []) {
      map.set(home.id, home.name);
    }
    return map;
  }, [homesQuery.data]);

  const isLoading = homesQuery.isLoading || bookingsQuery.isLoading;
  const error = homesQuery.error ?? bookingsQuery.error;

  return (
    <div className="grid gap-6">
      <Heading level={1} className="text-3xl text-emerald-950">
        Lịch đặt phòng
      </Heading>
      <div className="flex flex-wrap gap-3">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Ngày</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-emerald-200 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Phòng</span>
          <select
            value={homeId ?? ""}
            onChange={(e) =>
              setHomeId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="rounded-lg border border-emerald-200 px-3 py-2"
          >
            <option value="">Tất cả</option>
            {(homesQuery.data ?? []).map((home) => (
              <option key={home.id} value={home.id}>
                {home.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
      {isLoading ? (
        <LabeledSpinner>Đang tải…</LabeledSpinner>
      ) : (homesQuery.data ?? []).length === 0 ? (
        <p className="rounded-xl border border-emerald-100 bg-white p-8 text-center text-emerald-800/70">
          Chưa có phòng nào. Tạo phòng trong admin backend trước.
        </p>
      ) : (
        <div className="grid gap-3">
          {(bookingsQuery.data ?? []).length === 0 ? (
            <p className="rounded-xl border border-emerald-100 bg-white p-8 text-center text-emerald-800/70">
              Không có booking trong ngày này.
            </p>
          ) : (
            (bookingsQuery.data ?? []).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                homeName={
                  homesById.get(booking.home_id) ?? `Home ${booking.home_id}`
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
