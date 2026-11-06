"use client";

import Link from "next/link";
import type { CSSProperties, FC } from "react";

import {
  type AreaKey,
  MOBILE_FILTERS,
  MOBILE_STAYS,
  stayBookHref,
} from "@/constants/stays";

type Props = {
  area: AreaKey;
  onArea: (area: AreaKey) => void;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

export const MobileStays: FC<Props> = ({ area, onArea }) => {
  const label = MOBILE_FILTERS.find((f) => f.key === area)?.label ?? "";
  const stays = MOBILE_STAYS.filter((s) => s.area === area);

  return (
    <section
      className="m-block"
      id="m-residences"
      aria-labelledby="m-residences-title"
    >
      <p className="m-eyebrow reveal">Không gian dành cho bạn</p>
      <h2 className="h-section io" id="m-residences-title">
        <span className="mask">
          <span>Chọn căn La Verte</span>
        </span>
      </h2>
      {/* one open area needs no filter row */}
      {MOBILE_FILTERS.length > 1 ? (
        <div className="tabs" role="tablist" aria-label="Lọc căn theo khu vực">
          {MOBILE_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={f.key === area}
              onClick={() => onArea(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="stack" aria-live="polite">
        {stays.map((stay, i) => (
          <Link
            key={stay.key}
            className="scard"
            href={stayBookHref(stay)}
            style={{ "--i": i } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stay.img}
              alt={stay.alt}
              width={800}
              height={1000}
              loading={i === 0 ? "eager" : "lazy"}
            />
            <span className="badge">{label}</span>
            <span className="num">
              {pad2(i + 1)} / {pad2(stays.length)}
            </span>
            <div className="body io">
              <p className="kick">La Verte</p>
              <h3 className="display">
                <span className="mask">
                  <span>{stay.name.replace(/^La Verte /, "")}</span>
                </span>
              </h3>
              <div className="row">
                <div title="Giá tốt nhất trong 7 ngày tới">
                  <small>Giá tiết kiệm</small>
                  <b>{stay.price.replace("/h", "")} / giờ</b>
                </div>
                <span className="btn pill">Đặt ngay</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
