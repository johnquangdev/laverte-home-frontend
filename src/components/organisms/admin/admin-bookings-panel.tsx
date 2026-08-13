"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { FC } from "react";

import { Heading } from "@/components/atoms/heading";
import { LabeledSpinner } from "@/components/atoms/spinner";
import {
  useAdminBookingsQuery,
  useAdminHomesQuery,
} from "@/hooks/queries/admin";
import { formatVnd } from "@/utils/common";

export const AdminBookingsPanel: FC = () => {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [homeId, setHomeId] = useState<number | undefined>(undefined);

  const homesQuery = useAdminHomesQuery();
  const bookingsQuery = useAdminBookingsQuery(date, homeId);

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
      ) : (
        <div className="grid gap-3">
          {(bookingsQuery.data ?? []).length === 0 ? (
            <p className="rounded-xl border border-emerald-100 bg-white p-8 text-center text-emerald-800/70">
              Không có booking trong ngày này.
            </p>
          ) : (
            (bookingsQuery.data ?? []).map((booking) => (
              <article
                key={booking.id}
                className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-emerald-950">
                  #{booking.id} · {booking.customer_name}
                </h2>
                <p className="mt-1 text-sm text-emerald-800/80">
                  {homesById.get(booking.home_id) ?? `Home ${booking.home_id}`}{" "}
                  · {booking.status} · {formatVnd(booking.computed_price)}
                </p>
                <p className="mt-2 text-sm text-emerald-900/80">
                  {dayjs(booking.start_time).format("DD/MM/YYYY HH:mm")} →{" "}
                  {dayjs(booking.end_time).format("DD/MM/YYYY HH:mm")}
                </p>
                <p className="mt-1 text-sm">{booking.customer_phone}</p>
                {booking.door_lock_code ? (
                  <p className="mt-2 font-medium text-emerald-950">
                    Mã cửa: {booking.door_lock_code}
                  </p>
                ) : null}
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
};
