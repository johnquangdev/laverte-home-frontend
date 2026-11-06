"use client";

import {
  type CSSProperties,
  type FC,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import clsx from "clsx";

import { jumpTo, useReveal } from "@/components/organisms/mobile/motion";
import { LVM_ROOT } from "@/components/organisms/mobile/root";
import { type AreaKey, MOBILE_AREAS, MOBILE_FILTERS } from "@/constants/stays";

import { MobileHero } from "./hero";
import { MobileStays } from "./stays";

export const MobileHome: FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [area, setArea] = useState<AreaKey>(MOBILE_FILTERS[0].key);
  const [heroIn, setHeroIn] = useState(true);
  const [introIn, setIntroIn] = useState(false);
  const [footerIn, setFooterIn] = useState(false);

  useReveal(rootRef, area);

  // The site-wide useScrollToTop resets every page entry to the top, which
  // undoes the browser's own jump to a #fragment on a full load. Only the
  // phone's m- anchors are restored, so desktop deep links behave as before.
  useEffect(() => {
    if (!location.hash.startsWith("#m-")) return;
    document
      .getElementById(location.hash.slice(1))
      ?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    const watch = (
      el: Element | null,
      set: (v: boolean) => void,
      init?: IntersectionObserverInit
    ) => {
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => set(e.isIntersecting), init);
      io.observe(el);
      return io;
    };
    const observers = [
      watch(heroRef.current, setHeroIn, { threshold: 0.2 }),
      watch(document.getElementById("m-intro"), setIntroIn),
      // the footer has its own call buttons, so the bar steps aside there
      watch(document.querySelector("#m-footer .cta-row"), setFooterIn, {
        rootMargin: "0px 0px -20% 0px",
      }),
    ];
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Tint Safari's bars to the hero's sky only while no white section shows.
  const tinted = heroIn && !introIn;
  useEffect(() => {
    document.documentElement.classList.toggle("lvm-at-hero", tinted);
    return () => document.documentElement.classList.remove("lvm-at-hero");
  }, [tinted]);

  const openArea = (key: AreaKey) => {
    setArea(key);
    jumpTo("#m-residences");
  };

  const areaLine =
    MOBILE_FILTERS.length > 1
      ? `${MOBILE_FILTERS.length} khu vực · đặt theo giờ`
      : `${MOBILE_FILTERS[0].label} · đặt theo giờ`;

  return (
    <div ref={rootRef} className={LVM_ROOT}>
      <MobileHero heroRef={heroRef} />

      <section className="m-block intro" id="m-intro">
        <p className="m-eyebrow reveal">Lưu trú riêng tư theo giờ</p>
        <h2 className="h-section io">
          <span className="mask">
            <span>Ở một nơi đẹp,</span>
          </span>
          <span className="mask">
            <span>dành thời gian cho nhau.</span>
          </span>
        </h2>
        <p
          className="body-ash reveal"
          style={{ "--d": "0.1s" } as CSSProperties}
        >
          Những căn nhà ấm cúng giữa khoảng xanh, được chuẩn bị chỉn chu để bạn
          nghỉ ngơi, hẹn hò hoặc tận hưởng một ngày thật chậm theo cách riêng.
        </p>
        <div className="btns reveal" style={{ "--d": "0.2s" } as CSSProperties}>
          <a className="btn btn-primary" href="#m-residences">
            Chọn căn
          </a>
          <a className="btn btn-secondary" href="#m-story">
            Khám phá La Verte
          </a>
        </div>
      </section>

      <MobileStays area={area} onArea={setArea} />

      <section
        className="m-block moment io"
        id="m-membership"
        aria-labelledby="m-membership-title"
      >
        <p className="m-eyebrow">Dành cho hai người</p>
        <div className="ph">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/couple-retreat-banner.png"
            alt="Không gian La Verte riêng tư dành cho cặp đôi"
            width={1717}
            height={916}
            loading="lazy"
          />
        </div>
        <h2 className="h-sub" id="m-membership-title">
          <span className="mask">
            <span>Đủ riêng tư để nghỉ ngơi,</span>
          </span>
          <span className="mask">
            <span>đủ đẹp để mỗi cuộc hẹn đáng nhớ.</span>
          </span>
        </h2>
        <p className="body-ash">
          Không gian lưu trú ấm cúng cho hai người, giữa thiên nhiên dịu xanh và
          nhịp sống thật chậm.
        </p>
        <a className="btn btn-secondary" href="#m-residences">
          Setup kỷ niệm
        </a>
      </section>

      <section className="m-block" id="m-story" aria-labelledby="m-story-title">
        <p className="m-eyebrow reveal">Các khu vực triển khai</p>
        <h2 className="h-section io" id="m-story-title">
          <span className="mask">
            <span>Nơi bạn sẽ đến</span>
          </span>
        </h2>
        <div className="place">
          {MOBILE_AREAS.map((a) => (
            <article key={a.key} className="io">
              <div className="ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.img}
                  alt={a.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                />
                <span className="badge">{a.region}</span>
              </div>
              <h3>
                {a.name}, {a.region}
              </h3>
              <p>{a.desc}</p>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => openArea(a.key)}
              >
                Khám phá ↗
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="home-end" />

      <div className={clsx("reserve", (heroIn || footerIn) && "gone")}>
        <div>
          <b>Từ 119.000đ / giờ</b>
          <small>{areaLine}</small>
        </div>
        <Link className="btn btn-primary" href="/book">
          Đặt ngay
        </Link>
      </div>
    </div>
  );
};
