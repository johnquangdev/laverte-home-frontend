"use client";

import { type FC, useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#story", label: "Về La Verte" },
  { href: "#residences", label: "Chọn căn" },
  { href: "#membership", label: "Trải nghiệm" },
  { href: "#footer", label: "Liên hệ" },
];

const DRAWER_LINKS = [
  { href: "#story", label: "Về La Verte" },
  { href: "#story", label: "Điểm đến" },
  { href: "#membership", label: "Trải nghiệm" },
  { href: "#residences", label: "Chọn căn" },
];

export const SiteHeader: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 40);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  return (
    <>
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}`}
        data-header
      >
        <a className="brand" href="#top" aria-label="Trang chủ La Verte">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/verte-logo.png"
            alt="La Verte"
            width={220}
            height={54}
          />
        </a>
        <nav className="main-nav" aria-label="Điều hướng chính">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="lang-switch"
            type="button"
            aria-label="Đổi ngôn ngữ"
          >
            VIE
          </button>
          <button className="login-button" type="button">
            Đăng nhập
          </button>
          <button
            className="icon-menu"
            type="button"
            aria-label="Mở menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <aside
        className={`drawer${drawerOpen ? " is-open" : ""}`}
        data-drawer
        aria-hidden={!drawerOpen}
      >
        <button
          className="drawer-close"
          type="button"
          aria-label="Đóng menu"
          onClick={() => setDrawerOpen(false)}
        >
          ×
        </button>
        <nav aria-label="Điều hướng menu">
          {DRAWER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="drawer-foot">
          <span>Hotline 1900&nbsp;2208</span>
          <span>hello@laverte.vn</span>
        </div>
      </aside>
    </>
  );
};
