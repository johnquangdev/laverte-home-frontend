"use client";

import {
  type CSSProperties,
  type FC,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

import { prefersReducedMotion } from "@/components/organisms/mobile/motion";

type Props = {
  heroRef: RefObject<HTMLElement | null>;
};

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export const MobileHero: FC<Props> = ({ heroRef }) => {
  const fogRef = useRef<HTMLCanvasElement>(null);
  const [play, setPlay] = useState(false);

  // One frame later, so the hidden start states paint before the entrance runs.
  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useMist(fogRef, heroRef);

  // Parallax by CSS variables on the section: no re-render per pointer move.
  const setTilt = (x: number, y: number) => {
    heroRef.current?.style.setProperty("--px", x.toFixed(3));
    heroRef.current?.style.setProperty("--py", y.toFixed(3));
  };

  return (
    <section
      ref={heroRef}
      className={clsx("m-hero", play && "play")}
      id="m-hero"
      data-photo-top
      data-hide-brand
      aria-label="La Verte"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          ((e.clientY - r.top) / r.height) * 2 - 1
        );
      }}
      onPointerLeave={() => setTilt(0, 0)}
      onTouchEnd={() => setTilt(0, 0)}
    >
      <div className="scene">
        <div className="zoom">
          <div className="layer photo" />
          <canvas ref={fogRef} className="fog" aria-hidden="true" />
          <h1 className="title display">
            <span className="l1">La</span>
            <span className="l2">Verte</span>
          </h1>
          <div className="layer house" aria-hidden="true" />
        </div>
      </div>
      <div className="shade" />
      <div className="ui">
        <div
          className="hot fade"
          style={{ right: 16, top: "50%", ...delay(1.6) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mobile/hotspot-1.jpg"
            alt=""
            width={56}
            height={56}
          />
          <div>
            <b>Lưu trú riêng tư theo giờ</b>
            <span>Nhà, villa sạch, đẹp, kín đáo và linh hoạt.</span>
          </div>
        </div>
        <div
          className="lead h"
          style={{
            left: "33%",
            width: "calc(100% - 33% - 230px)",
            top: "calc(50% + 36px)",
            ...delay(2),
          }}
        />
        <div
          className="dot"
          style={{ left: "33%", top: "calc(50% + 36px)", ...delay(2.5) }}
        />
        <a
          className="hot fade"
          href="#m-residences"
          style={{ left: 16, top: "74%", ...delay(2.1) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mobile/hotspot-2.jpg"
            alt=""
            width={56}
            height={56}
          />
          <div>
            <b>Giá tiết kiệm</b>
            <span>Từ 119.000đ/h tại Bảo Lộc.</span>
          </div>
        </a>
        <div
          className="lead v"
          style={{ left: 150, top: "67%", height: "7%", ...delay(2.5) }}
        />
        <div className="dot" style={{ left: 150, top: "67%", ...delay(3) }} />
        <div className="down fade" style={delay(2.8)}>
          <a className="icon-btn glass" href="#m-intro" aria-label="Cuộn xuống">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

// Drifting mist and fireflies. Half-resolution canvas keeps it cheap; it stops
// drawing once the hero is off-screen so the rest of the page scrolls smoothly,
// and draws a single still frame under reduced motion.
const useMist = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  heroRef: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    const cv = canvasRef.current;
    const hero = heroRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !hero || !ctx) return;

    const still = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let blobs: { x: number; y: number; r: number; v: number; a: number }[] = [];
    let flies: { x: number; y: number; t: number; s: number }[] = [];
    let running = true;
    let raf = 0;

    const init = () => {
      w = cv.width = Math.round(cv.clientWidth / 2);
      h = cv.height = Math.round(cv.clientHeight / 2);
      blobs = Array.from({ length: 10 }, (_, k) => ({
        x: Math.random() * w,
        y: h * (0.42 + Math.random() * 0.3),
        r: w * (0.3 + Math.random() * 0.4),
        v: (0.05 + Math.random() * 0.1) * (k % 2 ? 1 : -1),
        a: 0.05 + Math.random() * 0.06,
      }));
      flies = Array.from({ length: 16 }, () => ({
        x: Math.random() * w,
        y: h * (0.55 + Math.random() * 0.35),
        t: Math.random() * 6,
        s: 0.4 + Math.random() * 0.6,
      }));
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of blobs) {
        b.x += b.v;
        if (b.x - b.r > w) b.x = -b.r;
        if (b.x + b.r < 0) b.x = w + b.r;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(200,212,230,${b.a})`);
        g.addColorStop(1, "rgba(200,212,230,0)");
        ctx.fillStyle = g;
        ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      }
      for (const f of flies) {
        f.t += 0.015 * f.s;
        f.x += Math.cos(f.t * 1.3) * 0.25;
        f.y += Math.sin(f.t) * 0.18;
        const a = Math.max(0, Math.sin(f.t * 2)) * 0.8;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 4);
        g.addColorStop(0, `rgba(255,214,140,${a})`);
        g.addColorStop(1, "rgba(255,214,140,0)");
        ctx.fillStyle = g;
        ctx.fillRect(f.x - 4, f.y - 4, 8, 8);
      }
      if (!still && running) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting;
      if (running && !was) frame();
    });
    io.observe(hero);
    init();
    frame();
    window.addEventListener("resize", init);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", init);
    };
  }, [canvasRef, heroRef]);
};
