"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { FC } from "react";

import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Paragraph } from "@/components/atoms/paragraph";
import { LabeledSpinner } from "@/components/atoms/spinner";
import { PaymentCard } from "@/components/molecules/cards/payment-card";
import { useCreateBookingMutation } from "@/hooks/mutations/booking";
import { useAvailabilityQuery, useHomesQuery } from "@/hooks/queries/homes";
import type { BookingEntity, BookingType } from "@/types/api/entities";

type Props = {
  defaultHomeId?: number;
};

const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: "hourly", label: "Theo giờ" },
  { value: "overnight", label: "Qua đêm" },
  { value: "day", label: "Theo ngày" },
];

export const BookingSection: FC<Props> = ({ defaultHomeId }) => {
  const today = dayjs().format("YYYY-MM-DD");
  const homesQuery = useHomesQuery();
  const [homeId, setHomeId] = useState<string>(
    defaultHomeId ? String(defaultHomeId) : ""
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingType, setBookingType] = useState<BookingType>("hourly");
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState("14:00");
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState("18:00");
  const [result, setResult] = useState<BookingEntity | null>(null);

  const createBooking = useCreateBookingMutation();
  const [overlapError, setOverlapError] = useState<string | null>(null);

  // Local wall-clock with its offset, not toISOString(): the guest picked a time
  // in their own zone, and the overnight rule's window is a wall-clock check.
  const start = dayjs(`${startDate}T${startTime}`);
  const end = dayjs(`${endDate}T${endTime}`);

  // Whole days around the chosen stay, so the guest sees what else is taken on
  // the days they are looking at, not only the exact minutes they typed.
  const windowFrom = dayjs(startDate).startOf("day").format();
  const windowTo = dayjs(endDate < startDate ? startDate : endDate)
    .add(1, "day")
    .startOf("day")
    .format();
  const availability = useAvailabilityQuery(
    homeId ? Number(homeId) : undefined,
    windowFrom,
    windowTo
  );
  const busy = useMemo(
    () => availability.data?.busy ?? [],
    [availability.data]
  );
  const clash = busy.find(
    (b) => start.isBefore(dayjs(b.end_time)) && end.isAfter(dayjs(b.start_time))
  );

  useEffect(() => {
    if (homeId || !homesQuery.data?.length) return;
    setHomeId(String(homesQuery.data[0].id));
  }, [homeId, homesQuery.data]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // The server's exclusion constraint is the real guard; this only saves the
    // guest a round trip for a slot they can already see is taken.
    if (clash) {
      setOverlapError(
        `Khung ${dayjs(clash.start_time).format("DD/MM HH:mm")}–${dayjs(clash.end_time).format("HH:mm")} đã có người đặt. Vui lòng chọn giờ khác.`
      );
      return;
    }
    setOverlapError(null);
    const booking = await createBooking.mutateAsync({
      home_id: Number(homeId),
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      booking_type: bookingType,
      start_time: start.format(),
      end_time: end.format(),
    });
    setResult(booking);
  };

  const selectedHome = homesQuery.data?.find(
    (home) => String(home.id) === homeId
  );

  return (
    <Container className="py-12">
      <Heading level={1} className="text-3xl text-emerald-950">
        Đặt phòng
      </Heading>
      <Paragraph level={1} className="mt-2 max-w-2xl text-emerald-800/80">
        Chọn phòng và điền thông tin bên dưới. Sau khi tạo đặt phòng, bạn sẽ
        thấy mã VietQR để chuyển khoản trong 15 phút.
      </Paragraph>

      <div className="mt-8 max-w-xl">
        {result ? (
          <PaymentCard booking={result} onReset={() => setResult(null)} />
        ) : homesQuery.isLoading ? (
          <LabeledSpinner>Đang tải danh sách phòng…</LabeledSpinner>
        ) : homesQuery.error ? (
          <p className="text-sm text-red-600">{homesQuery.error.message}</p>
        ) : (homesQuery.data ?? []).length === 0 ? (
          <p className="rounded-xl border border-emerald-100 bg-white p-6 text-emerald-800/80">
            Hiện chưa có phòng nào mở đặt. Vui lòng quay lại sau.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-emerald-950">Phòng</span>
              <select
                required
                value={homeId}
                onChange={(e) => setHomeId(e.target.value)}
                className="rounded-lg border border-emerald-200 px-3 py-2.5"
              >
                {(homesQuery.data ?? []).map((home) => (
                  <option key={home.id} value={home.id}>
                    {home.name}
                    {home.category === "nest" ? " (Nest)" : ""}
                  </option>
                ))}
              </select>
              {selectedHome?.description ? (
                <span className="text-emerald-800/70">
                  {selectedHome.description}
                </span>
              ) : null}
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-emerald-950">Họ tên</span>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                autoComplete="name"
                className="rounded-lg border border-emerald-200 px-3 py-2.5"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-emerald-950">
                Số điện thoại
              </span>
              <input
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                className="rounded-lg border border-emerald-200 px-3 py-2.5"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-emerald-950">Loại đặt</span>
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value as BookingType)}
                className="rounded-lg border border-emerald-200 px-3 py-2.5"
              >
                {BOOKING_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-emerald-950">Nhận phòng</span>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-emerald-200 px-3 py-2.5"
                />
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="rounded-lg border border-emerald-200 px-3 py-2.5"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-emerald-950">Trả phòng</span>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-emerald-200 px-3 py-2.5"
                />
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="rounded-lg border border-emerald-200 px-3 py-2.5"
                />
              </label>
            </div>
            <div className="grid gap-1.5 text-sm" aria-live="polite">
              <span className="font-medium text-emerald-950">
                Khung giờ đã kín trong những ngày này
              </span>
              {availability.isLoading ? (
                <span className="text-emerald-800/70">Đang kiểm tra lịch…</span>
              ) : busy.length === 0 ? (
                <span className="text-emerald-800/70">
                  Chưa có ai đặt, bạn chọn giờ nào cũng được.
                </span>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {busy.map((b) => (
                    <li
                      key={`${b.start_time}-${b.end_time}`}
                      className="rounded-full border border-emerald-200 px-3 py-1 text-emerald-900 tabular-nums"
                    >
                      {dayjs(b.start_time).format("DD/MM HH:mm")}–
                      {dayjs(b.end_time).format(
                        dayjs(b.end_time).isSame(dayjs(b.start_time), "day")
                          ? "HH:mm"
                          : "DD/MM HH:mm"
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {overlapError ? (
              <p className="text-sm text-red-600" role="alert">
                {overlapError}
              </p>
            ) : null}
            {createBooking.error ? (
              <p className="text-sm text-red-600">
                {createBooking.error.message}
              </p>
            ) : null}
            <Button
              type="submit"
              variant="secondary"
              shape="pill"
              loading={createBooking.isPending}
              className="w-full"
            >
              Tiếp tục thanh toán
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
};
