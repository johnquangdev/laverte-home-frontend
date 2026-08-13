"use client";

import dayjs from "dayjs";
import type { FC } from "react";

import { Button } from "@/components/atoms/button";
import type { BookingEntity } from "@/types/api/entities";
import { formatVnd } from "@/utils/common";

type Props = {
  booking: BookingEntity;
  onReset: () => void;
};

export const PaymentCard: FC<Props> = ({ booking, onReset }) => {
  return (
    <div className="grid gap-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-emerald-950">
          Thanh toán VietQR
        </h2>
        <p className="mt-1 text-sm text-emerald-800/80">
          Mã #{booking.id} · {formatVnd(booking.computed_price)}
        </p>
      </div>
      <div className="rounded-xl bg-emerald-50/60 p-4 text-sm text-emerald-900">
        <p>
          <span className="font-medium">Khách:</span> {booking.customer_name} (
          {booking.customer_phone})
        </p>
        <p className="mt-1">
          <span className="font-medium">Thời gian:</span>{" "}
          {dayjs(booking.start_time).format("DD/MM/YYYY HH:mm")} →{" "}
          {dayjs(booking.end_time).format("DD/MM/YYYY HH:mm")}
        </p>
        {booking.expires_at ? (
          <p className="mt-1">
            <span className="font-medium">Hết hạn giữ chỗ:</span>{" "}
            {dayjs(booking.expires_at).format("DD/MM/YYYY HH:mm")}
          </p>
        ) : null}
      </div>
      {booking.qr_content ? (
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={booking.qr_content}
            alt="Mã QR thanh toán VietQR"
            className="max-h-72 rounded-xl border border-emerald-100 bg-white p-3"
          />
          <p className="text-center text-sm text-emerald-800/80">
            Quét mã để chuyển khoản đúng số tiền. Hệ thống tự xác nhận sau vài
            giây.
          </p>
        </div>
      ) : null}
      <Button
        type="button"
        variant="outline"
        shape="pill"
        className="w-full"
        onClick={onReset}
      >
        Đặt phòng khác
      </Button>
    </div>
  );
};
