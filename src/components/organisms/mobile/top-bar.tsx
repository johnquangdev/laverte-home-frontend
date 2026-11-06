"use client";

import { type FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { CONTACT } from "@/constants/stays";

import { jumpTo } from "./motion";
import { LVM_ROOT } from "./root";

// From the live drawer (site-header.tsx) plus "Liên hệ". Mobile sections carry
// an `m-` id prefix because the hidden desktop tree already uses the bare ids.
const MENU = [
  { href: "/#m-story", label: "Về La Verte" },
  { href: "/#m-story", label: "Điểm đến" },
  { href: "/#m-membership", label: "Trải nghiệm" },
  { href: "/#m-residences", label: "Chọn căn" },
  { href: "#m-footer", label: "Liên hệ" },
];

// Keyed by path so the photo/brand state of one page never leaks into the next.
export const MobileTopBar: FC = () => <TopBar key={usePathname()} />;

const TopBar: FC = () => {
  const [open, setOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [onPhoto, setOnPhoto] = useState(false);
  const [hideBrand, setHideBrand] = useState(false);

  // Like the live header: clear with a white logo while a photo sits under the
  // bar, white with the navy logo once it scrolls past. The observer's root is
  // shrunk to the bar's own strip at the top of the screen.
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const photo = document.querySelector(".lvm [data-photo-top]");
    if (photo) {
      const io = new IntersectionObserver(
        ([e]) => setOnPhoto(e.isIntersecting),
        {
          rootMargin: `0px 0px -${Math.max(0, window.innerHeight - 72)}px 0px`,
        }
      );
      io.observe(photo);
      observers.push(io);
    }
    const brandless = document.querySelector(".lvm [data-hide-brand]");
    if (brandless) {
      const io = new IntersectionObserver(
        ([e]) => setHideBrand(e.isIntersecting),
        { threshold: 0.2 }
      );
      io.observe(brandless);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // A disclosure, not a modal: the toggle that closes it sits in the bar
  // outside the sheet, so focus is walked in on open and back on close.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    sheetRef.current?.querySelector("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const menuBtn = menuBtnRef.current;
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      menuBtn?.focus({ preventScroll: true });
    };
  }, [open]);

  // Same-page anchors inside the phone layout jump with a view transition.
  // Capture phase, so this runs before next/link handles the click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>(
        ".lvm a[href*='#']"
      );
      if (!a) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname)
        return;
      if (!url.hash || !document.getElementById(url.hash.slice(1))) return;
      e.preventDefault();
      e.stopPropagation();
      jumpTo(url.hash, () => setOpen(false));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div className={LVM_ROOT}>
      <header
        className={clsx(
          "topbar",
          onPhoto && "is-photo",
          hideBrand && "hide-brand",
          open && "menu-open"
        )}
      >
        <Link className="m-brand" href="/" aria-label="Trang chủ La Verte">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mobile/logo.png"
            alt="La Verte"
            width={89}
            height={20}
          />
        </Link>
        <div className="actions">
          <Link className="cta btn btn-primary pill" href="/#m-residences">
            Chọn căn
          </Link>
          <button
            ref={menuBtnRef}
            className="icon-btn menu-btn"
            type="button"
            aria-controls="lvm-menu"
            aria-expanded={open}
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        ref={sheetRef}
        className={clsx("sheet", open && "open")}
        id="lvm-menu"
        inert={!open}
      >
        <nav aria-label="Điều hướng menu">
          {MENU.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="foot">
          <a className="btn btn-primary" href={`tel:${CONTACT.tel}`}>
            Hotline {CONTACT.hotline}
          </a>
          <a className="btn btn-secondary" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
        </div>
      </div>
    </div>
  );
};
