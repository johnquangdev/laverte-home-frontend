"use client";

import { type FC, useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    src: "/images/home-hero.jpg",
    alt: "Không gian phòng khách La Verte với nội thất ấm cúng",
    extra: "",
  },
  {
    src: "/images/hero-home-1-portrait.jpg",
    alt: "Phòng khách La Verte với giếng trời và khoảng xanh",
    extra: " hero-slide-portrait",
  },
  {
    src: "/images/hero-home-1-wide.jpg",
    alt: "Ngoại thất La Verte trong ánh hoàng hôn tại Bảo Lộc",
    extra: " hero-slide-exterior",
  },
  {
    src: "/images/hero-home-2-bedroom.jpg",
    alt: "Phòng ngủ La Verte được chuẩn bị chỉn chu",
    extra: "",
  },
];

const INTERVAL_MS = 5000;

export const Hero: FC = () => {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stop();
    timer.current = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS
    );
  }, [stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-layout">
        <figure
          className="hero-feature"
          data-hero-slider
          onMouseEnter={stop}
          onMouseLeave={start}
        >
          {SLIDES.map((slide, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.src}
              className={`hero-slide${slide.extra}${i === active ? " is-active" : ""}`}
              src={slide.src}
              alt={slide.alt}
              fetchPriority={i === 0 ? "high" : "low"}
            />
          ))}
        </figure>

        <div className="hero-copy">
          <h1 id="hero-title">Ở một nơi đẹp, dành thời gian cho nhau.</h1>
          <p>
            Những căn nhà ấm cúng giữa khoảng xanh, được chuẩn bị chỉn chu để
            bạn nghỉ ngơi, hẹn hò hoặc tận hưởng một ngày thật chậm theo cách
            riêng.
          </p>
          <div className="hero-actions">
            <a className="orange-cta" href="#residences">
              Chọn căn
            </a>
            <a className="black-cta" href="#story">
              Khám phá La Verte
            </a>
          </div>
        </div>

        <div className="hero-pagination" aria-label="Chọn ảnh đầu trang">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              className={i === active ? "is-active" : undefined}
              type="button"
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === active ? "true" : "false"}
              onClick={() => {
                setActive(i);
                start();
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
