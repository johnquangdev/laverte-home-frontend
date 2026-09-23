"use client";

import { useState } from "react";
import dayjs from "dayjs";
import type { FC } from "react";

import { AdminDialog } from "@/components/organisms/admin/admin-dialog";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_FIELD,
  AdminField,
  AdminFormError,
} from "@/components/organisms/admin/admin-form";
import { BOOKING_TYPE_LABELS } from "@/constants/admin";
import { useCreateWalkInBookingMutation } from "@/hooks/mutations/admin-booking";
import type {
  AdminBookingEntity,
  BookingType,
  HomeEntity,
} from "@/types/api/entities";
import { formatVnd } from "@/utils/common";
import { localInputToIso } from "@/utils/datetime";

type Props = {
  homes: HomeEntity[];
  defaultHomeId: number | undefined;
  onClose: () => void;
  onCreated: (booking: AdminBookingEntity) => void;
};

type Errors = Partial<Record<"name" | "phone" | "end", string>>;

// Loose on purpose: the backend normalises and is the real check. This only
// catches a number that is obviously too short or long before the round trip.
const looksLikeVnPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 13;
};

/**
 * A walk-in is created confirmed, not held: the guest is standing at the door,
 * so there is no payment window for the expiry sweep to reclaim.
 */
export const AdminWalkInDialog: FC<Props> = ({
  homes,
  defaultHomeId,
  onClose,
  onCreated,
}) => {
  const [homeId, setHomeId] = useState(defaultHomeId ?? homes[0]?.id ?? 0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingType, setBookingType] = useState<BookingType>("hourly");
  const [start, setStart] = useState(() => {
    const now = dayjs();
    // Round up to the next half hour: nobody checks in at 14:07.
    const minutes = now.minute() < 30 ? 30 : 60;
    return now.minute(0).add(minutes, "minute").format("YYYY-MM-DDTHH:mm");
  });
  const [end, setEnd] = useState(() =>
    dayjs(start).add(3, "hour").format("YYYY-MM-DDTHH:mm")
  );
  const [paidCash, setPaidCash] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createWalkIn = useCreateWalkInBookingMutation();

  const submit = async () => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Nhập tên khách.";
    if (!looksLikeVnPhone(phone)) {
      next.phone = "Nhập số điện thoại của khách, ví dụ 0901 234 567.";
    }
    if (!start || !end || !dayjs(end).isAfter(dayjs(start))) {
      next.end = "Giờ trả phòng phải sau giờ nhận phòng.";
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`walkin-${first}`)?.focus();
      return;
    }

    setSubmitError(null);
    try {
      const booking = await createWalkIn.mutateAsync({
        home_id: homeId,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        start_time: localInputToIso(start),
        end_time: localInputToIso(end),
        booking_type: bookingType,
        paid_cash: paidCash,
      });
      onCreated(booking);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Tạo booking thất bại"
      );
    }
  };

  const hours = dayjs(end).diff(dayjs(start), "minute") / 60;

  return (
    <AdminDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Tạo booking tại chỗ"
      description="Booking được xác nhận ngay, giá tính theo bảng giá hiện hành của hạng phòng."
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
            disabled={createWalkIn.isPending}
            className={ADMIN_BTN_PRIMARY}
          >
            {createWalkIn.isPending ? "Đang tạo…" : "Tạo booking"}
          </button>
        </>
      }
    >
      <div className="grid gap-4">
        <AdminFormError message={submitError} />

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField id="walkin-home" label="Phòng">
            <select
              id="walkin-home"
              name="home_id"
              value={homeId}
              onChange={(e) => setHomeId(Number(e.target.value))}
              className={ADMIN_FIELD}
            >
              {homes.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                  {h.is_active ? "" : " (tạm ngưng)"}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField id="walkin-type" label="Loại booking">
            <select
              id="walkin-type"
              name="booking_type"
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value as BookingType)}
              className={ADMIN_FIELD}
            >
              {(Object.keys(BOOKING_TYPE_LABELS) as BookingType[]).map((t) => (
                <option key={t} value={t}>
                  {BOOKING_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </AdminField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField id="walkin-name" label="Tên khách" error={errors.name}>
            <input
              id="walkin-name"
              name="customer_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A…"
              autoComplete="off"
              maxLength={100}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "walkin-name-error" : undefined}
              className={ADMIN_FIELD}
            />
          </AdminField>
          <AdminField
            id="walkin-phone"
            label="Số điện thoại"
            error={errors.phone}
            hint="Mã cửa sẽ gửi qua Zalo số này."
          >
            <input
              id="walkin-phone"
              name="customer_phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0901 234 567…"
              autoComplete="off"
              maxLength={20}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={
                errors.phone ? "walkin-phone-error" : "walkin-phone-hint"
              }
              className={`${ADMIN_FIELD} tabular-nums`}
            />
          </AdminField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField id="walkin-start" label="Nhận phòng">
            <input
              id="walkin-start"
              type="datetime-local"
              name="start_time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className={`${ADMIN_FIELD} tabular-nums`}
            />
          </AdminField>
          <AdminField
            id="walkin-end"
            label="Trả phòng"
            error={errors.end}
            hint={hours > 0 ? `${Math.round(hours * 10) / 10} giờ` : undefined}
          >
            <input
              id="walkin-end"
              type="datetime-local"
              name="end_time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              aria-invalid={errors.end ? true : undefined}
              aria-describedby={errors.end ? "walkin-end-error" : undefined}
              className={`${ADMIN_FIELD} tabular-nums`}
            />
          </AdminField>
        </div>

        <label className="min-h-control-lg text-admin-ink flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="paid_cash"
            checked={paidCash}
            onChange={(e) => setPaidCash(e.target.checked)}
            className="accent-admin-accent size-5 shrink-0"
          />
          Khách đã trả tiền mặt (ghi nhận doanh thu ngay)
        </label>
      </div>
    </AdminDialog>
  );
};

export const walkInCreatedMessage = (booking: AdminBookingEntity): string =>
  `Đã tạo booking #${booking.id} cho ${booking.customer_name}, ${formatVnd(booking.computed_price)}.`;
