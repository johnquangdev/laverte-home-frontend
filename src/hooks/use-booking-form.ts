"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { useCreateBookingMutation } from "@/hooks/mutations/booking";
import { useAvailabilityQuery, useHomesQuery } from "@/hooks/queries/homes";
import type { BookingEntity, BookingType } from "@/types/api/entities";

export const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: "hourly", label: "Theo giờ" },
  { value: "overnight", label: "Qua đêm" },
  { value: "day", label: "Theo ngày" },
];

export const useBookingForm = (defaultHomeId?: number) => {
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

  const handleSubmit = async (event: FormEvent) => {
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

  return {
    homesQuery,
    homeId,
    setHomeId,
    selectedHome,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    bookingType,
    setBookingType,
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    start,
    end,
    availability,
    busy,
    clash,
    overlapError,
    createBooking,
    result,
    setResult,
    handleSubmit,
  };
};
