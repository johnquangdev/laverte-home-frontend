"use client";

import { type FC, useState } from "react";
import Link from "next/link";

import { AREA_FILTERS as FILTERS, STAYS } from "@/constants/stays";

export const Residences: FC = () => {
  const [active, setActive] = useState("bao-loc");

  return (
    <section
      className="destinations section-wrap"
      id="residences"
      aria-labelledby="destinations-title"
    >
      <div className="split-title">
        <div>
          <p className="section-kicker">Không gian dành cho bạn</p>
          <h2 id="destinations-title">Chọn căn La Verte</h2>
        </div>
        <div
          className="segmented"
          role="tablist"
          aria-label="Lọc căn theo khu vực"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={active === f.key ? "active" : undefined}
              type="button"
              role="tab"
              aria-selected={active === f.key}
              onClick={() => setActive(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="stay-grid" data-grid>
        {STAYS.map((stay) => (
          <article
            className={`stay-card${stay.area !== active ? " is-hidden" : ""}`}
            data-location={stay.area}
            key={stay.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={stay.img} alt={stay.alt} loading="lazy" />
            <div>
              <h3>{stay.name}</h3>
              <p title="Giá tốt nhất trong 7 ngày tới">
                <span>Giá tiết kiệm</span>
                <strong>{stay.price}</strong>
              </p>
              <Link className="book-now" href="/book">
                Đặt ngay
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
