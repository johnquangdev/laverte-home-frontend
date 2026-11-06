import type { FC } from "react";

import { CONTACT, MOBILE_FILTERS } from "@/constants/stays";

import { LVM_ROOT } from "./root";

const SOCIALS = [
  { href: "#", label: "Facebook", glyph: "f" },
  { href: "#", label: "Instagram", glyph: "◎" },
  { href: "#", label: "TikTok", glyph: "♪" },
  { href: "#", label: "LinkedIn", glyph: "in" },
];

// Same groups as site-footer.tsx; "Điểm đến" follows the areas open on phones.
const LINK_GROUPS = [
  {
    title: "Trải nghiệm",
    links: [
      { href: "#", label: "Lưu trú riêng tư theo giờ" },
      { href: "#", label: "Setup kỷ niệm" },
    ],
  },
  {
    title: "La Verte",
    links: [
      { href: "#", label: "Về chúng tôi" },
      { href: "/#m-story", label: "Khu vực triển khai" },
      { href: "#", label: "Phong cách La Verte" },
    ],
  },
  {
    title: "Điểm đến",
    links: MOBILE_FILTERS.map((f) => ({
      href: "/#m-residences",
      label: f.label,
    })),
  },
  {
    title: "Chính sách",
    links: [
      { href: "#", label: "Chính sách bảo mật" },
      { href: "#", label: "Xác minh khách" },
      { href: "#", label: "An toàn lưu trú" },
    ],
  },
];

export const MobileFooter: FC = () => (
  <div className={LVM_ROOT}>
    <footer className="footer" id="m-footer">
      <h2 className="h-sub">Chọn một khoảng xanh cho lần nghỉ tiếp theo</h2>
      <p className="body-ash">
        La Verte hiện diện tại Bảo Lộc và đang chuẩn bị những điểm đến mới dành
        cho bạn.
      </p>
      <div className="rows">
        <a href={`tel:${CONTACT.tel}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
          </svg>
          <span>
            <small>Hotline</small>
            <b>{CONTACT.hotline}&nbsp;/ Zalo&nbsp;OA</b>
          </span>
        </a>
        <a href={`mailto:${CONTACT.email}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <span>
            <small>Email</small>
            <b>{CONTACT.email}</b>
          </span>
        </a>
      </div>
      <div className="cta-row">
        <a className="btn btn-primary" href={`tel:${CONTACT.tel}`}>
          Gọi ngay
        </a>
        <a className="btn btn-secondary" href={`mailto:${CONTACT.email}`}>
          Liên hệ La Verte
        </a>
      </div>
      <h3>Theo dõi chúng tôi qua</h3>
      <div className="m-socials">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            className="icon-btn"
            href={s.href}
            aria-label={s.label}
          >
            {s.glyph}
          </a>
        ))}
      </div>
      <div className="links">
        {LINK_GROUPS.map((group) => (
          <details key={group.title}>
            <summary>{group.title}</summary>
            <ul>
              {group.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <p className="copy-note">
        © CÔNG TY CỔ PHẦN LA VERTE. Giao diện website ý tưởng.
      </p>
    </footer>
  </div>
);
