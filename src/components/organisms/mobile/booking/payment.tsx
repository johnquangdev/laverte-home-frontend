"use client";

import { type FC, useEffect, useState } from "react";
import clsx from "clsx";
import dayjs from "dayjs";

import type { BookingEntity } from "@/types/api/entities";
import { formatHold, holdSecondsLeft } from "@/utils/booking-time";
import { formatVnd } from "@/utils/common";

type Props = {
  booking: BookingEntity;
  onReset: () => void;
};

const full = (iso: string) => dayjs(iso).format("DD/MM/YYYY HH:mm");

export const MobilePayment: FC<Props> = ({ booking, onReset }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!booking.expires_at) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [booking.expires_at]);

  const left = holdSecondsLeft(booking.expires_at, now);
  // The expiry job has released the hold by now and a late transfer is
  // refused by the payment webhook, so the QR must not invite one.
  const expired = left === 0;

  return (
    <section className="pay" aria-labelledby="m-pay-title">
      <p className="m-eyebrow">Thanh toán VietQR</p>
      <h1 id="m-pay-title">Mã #{booking.id}</h1>
      <p className="amount">{formatVnd(booking.computed_price)}</p>

      {expired ? (
        <p className="err" role="alert">
          Hết thời gian giữ chỗ. Vui lòng đặt lại để nhận mã mới.
        </p>
      ) : (
        <>
          {booking.qr_content ? (
            <>
              <div className="qr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.qr_content}
                  alt="Mã QR thanh toán VietQR"
                  width={280}
                  height={280}
                />
              </div>
              <p className="scan">
                Quét mã để chuyển khoản đúng số tiền. Hệ thống tự xác nhận sau
                vài giây.
              </p>
            </>
          ) : null}
          {left !== null ? (
            <div className="clock" aria-live="off">
              <span>
                <i aria-hidden="true" />
                Giữ chỗ còn <b>{formatHold(left)}</b>
              </span>
            </div>
          ) : null}
        </>
      )}

      <dl className="facts">
        <div>
          <dt>Khách</dt>
          <dd>
            {booking.customer_name} ({booking.customer_phone})
          </dd>
        </div>
        <div>
          <dt>Thời gian</dt>
          <dd>
            {full(booking.start_time)} → {full(booking.end_time)}
          </dd>
        </div>
        {booking.expires_at ? (
          <div>
            <dt>Hết hạn giữ chỗ</dt>
            <dd>{full(booking.expires_at)}</dd>
          </div>
        ) : null}
      </dl>

      <button
        className={clsx(
          "btn btn-block",
          expired ? "btn-primary" : "btn-secondary"
        )}
        type="button"
        onClick={onReset}
      >
        Đặt phòng khác
      </button>
    </section>
  );
};
