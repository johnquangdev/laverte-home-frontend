"use client";

import { type FC, useEffect, useRef } from "react";
import dayjs from "dayjs";

import { MobilePayment } from "@/components/organisms/mobile/booking/payment";
import { useReveal } from "@/components/organisms/mobile/motion";
import { LVM_ROOT } from "@/components/organisms/mobile/root";
import { AREA_FILTERS, findStay, STAYS } from "@/constants/stays";
import { BOOKING_TYPES, useBookingForm } from "@/hooks/use-booking-form";
import { durationLabel } from "@/utils/booking-time";

type Props = {
  defaultHomeId?: number;
  stayKey?: string;
};

const FORM_ID = "lvm-book-form";

export const MobileBooking: FC<Props> = ({ defaultHomeId, stayKey }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stay = findStay(stayKey);
  const form = useBookingForm(defaultHomeId ?? stay?.homeId);
  const { homesQuery, selectedHome, result } = form;

  useReveal(rootRef, result ? "pay" : "form");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [result]);

  const areaLabel = stay
    ? AREA_FILTERS.find((a) => a.key === stay.area)?.label
    : undefined;
  const inArea = stay ? STAYS.filter((s) => s.area === stay.area) : [];
  const homes = homesQuery.data ?? [];
  const ready = !homesQuery.isLoading && !homesQuery.error && homes.length > 0;

  const busyLabel = (b: { start_time: string; end_time: string }) => {
    const s = dayjs(b.start_time);
    const e = dayjs(b.end_time);
    return `${s.format("DD/MM HH:mm")}–${e.format(e.isSame(s, "day") ? "HH:mm" : "DD/MM HH:mm")}`;
  };

  const sameDay = form.start.isSame(form.end, "day");
  const range = `${form.start.format("DD/MM HH:mm")} → ${form.end.format(sameDay ? "HH:mm" : "DD/MM HH:mm")}`;

  return (
    <div ref={rootRef} className={LVM_ROOT}>
      {/* stays mounted while paying so the top bar's photo observer keeps its target */}
      <div hidden={!!result}>
        <div className="bk-photo" data-photo-top>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stay?.img ?? "/images/home-hero.jpg"}
            alt={stay?.alt ?? "Không gian La Verte"}
            width={1200}
            height={1110}
            fetchPriority="high"
          />
          {stay ? (
            <span className="count">
              {inArea.indexOf(stay) + 1} / {inArea.length}
            </span>
          ) : null}
        </div>

        <div className="bk-sheet">
          <h1 className="io">
            <span className="mask">
              <span>{stay?.name ?? selectedHome?.name ?? "Đặt phòng"}</span>
            </span>
          </h1>
          {stay ? (
            <p className="sub reveal" title="Giá tốt nhất trong 7 ngày tới">
              {areaLabel} · Giá tiết kiệm <b>{stay.price.replace("/h", "")}</b>{" "}
              / giờ
            </p>
          ) : selectedHome?.address ? (
            <p className="sub reveal">{selectedHome.address}</p>
          ) : null}
          <hr />
          <h2 className="h-sub reveal">Đặt phòng</h2>
          <p className="body-ash reveal">
            Chọn phòng và điền thông tin bên dưới. Sau khi tạo đặt phòng, bạn sẽ
            thấy mã VietQR để chuyển khoản trong 15 phút.
          </p>

          {homesQuery.isLoading ? (
            <p className="bk-state" aria-live="polite">
              Đang tải danh sách phòng…
            </p>
          ) : homesQuery.error ? (
            <p className="err" role="alert">
              {homesQuery.error.message}
            </p>
          ) : homes.length === 0 ? (
            <p className="bk-state">
              Hiện chưa có phòng nào mở đặt. Vui lòng quay lại sau.
            </p>
          ) : (
            <form
              id={FORM_ID}
              // The hook reports a failed create through createBooking.error,
              // shown below; the rejected promise itself has nowhere to go.
              onSubmit={(e) => void form.handleSubmit(e).catch(() => {})}
            >
              <div className="panel">
                <div className="box">
                  <label className="cell select">
                    <span>Phòng</span>
                    <select
                      required
                      name="home"
                      value={form.homeId}
                      onChange={(e) => form.setHomeId(e.target.value)}
                    >
                      {homes.map((home) => (
                        <option key={home.id} value={home.id}>
                          {home.name}
                          {home.category === "nest" ? " (Nest)" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {selectedHome?.description ? (
                  <p className="home-desc">{selectedHome.description}</p>
                ) : null}

                <p className="q" id="m-type-label">
                  Loại đặt
                </p>
                <div
                  className="chips"
                  role="radiogroup"
                  aria-labelledby="m-type-label"
                >
                  {BOOKING_TYPES.map((t) => (
                    <label key={t.value}>
                      <input
                        type="radio"
                        name="booking_type"
                        value={t.value}
                        checked={form.bookingType === t.value}
                        onChange={() => form.setBookingType(t.value)}
                      />
                      <span>{t.label}</span>
                    </label>
                  ))}
                </div>

                <p className="q">
                  Thời gian
                  <small>
                    {durationLabel(form.start.toDate(), form.end.toDate())}
                  </small>
                </p>
                <div className="box">
                  <div className="grid2">
                    <label className="cell">
                      <span>Nhận phòng</span>
                      <input
                        type="date"
                        name="start_date"
                        required
                        value={form.startDate}
                        onChange={(e) => form.setStartDate(e.target.value)}
                      />
                    </label>
                    <label className="cell">
                      <span>Trả phòng</span>
                      <input
                        type="date"
                        name="end_date"
                        required
                        value={form.endDate}
                        onChange={(e) => form.setEndDate(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="grid2">
                    <label className="cell">
                      <span>Giờ nhận</span>
                      <input
                        type="time"
                        name="start_time"
                        required
                        value={form.startTime}
                        onChange={(e) => form.setStartTime(e.target.value)}
                      />
                    </label>
                    <label className="cell">
                      <span>Giờ trả</span>
                      <input
                        type="time"
                        name="end_time"
                        required
                        value={form.endTime}
                        onChange={(e) => form.setEndTime(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <div aria-live="polite">
                  <p className="q">Khung giờ đã kín trong những ngày này</p>
                  {form.availability.isLoading ? (
                    <p className="free">Đang kiểm tra lịch…</p>
                  ) : form.busy.length === 0 ? (
                    <p className="free">
                      Chưa có ai đặt, bạn chọn giờ nào cũng được.
                    </p>
                  ) : (
                    <ul className="busy">
                      {form.busy.map((b) => (
                        <li
                          key={`${b.start_time}-${b.end_time}`}
                          className={b === form.clash ? "hit" : undefined}
                        >
                          {busyLabel(b)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="panel">
                <p className="q">Thông tin của bạn</p>
                <div className="box">
                  <label className="cell">
                    <span>Họ tên</span>
                    <input
                      required
                      name="name"
                      autoComplete="name"
                      placeholder="Nguyễn Văn A…"
                      value={form.customerName}
                      onChange={(e) => form.setCustomerName(e.target.value)}
                    />
                  </label>
                  <label className="cell">
                    <span>Số điện thoại</span>
                    <input
                      required
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="0901 234 567…"
                      value={form.customerPhone}
                      onChange={(e) => form.setCustomerPhone(e.target.value)}
                    />
                  </label>
                </div>
                {form.overlapError ? (
                  <p className="err" role="alert">
                    {form.overlapError}
                  </p>
                ) : null}
                {form.createBooking.error ? (
                  <p className="err" role="alert">
                    {form.createBooking.error.message}
                  </p>
                ) : null}
              </div>
              <p className="bk-note">
                Bạn chỉ thanh toán sau khi nhận mã VietQR.
              </p>
            </form>
          )}
        </div>
      </div>

      {result ? (
        <MobilePayment booking={result} onReset={() => form.setResult(null)} />
      ) : null}

      {ready && !result ? (
        <div className="reserve">
          <div>
            <b>{durationLabel(form.start.toDate(), form.end.toDate())}</b>
            <small>{range}</small>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            form={FORM_ID}
            disabled={form.createBooking.isPending}
          >
            {form.createBooking.isPending
              ? "Đang tạo đặt phòng…"
              : "Tiếp tục thanh toán"}
          </button>
        </div>
      ) : null}
    </div>
  );
};
