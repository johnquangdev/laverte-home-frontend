import type { FC } from "react";

const SOCIALS = [
  { href: "#", label: "Facebook", glyph: "f" },
  { href: "#", label: "Instagram", glyph: "◎" },
  { href: "#", label: "TikTok", glyph: "♪" },
  { href: "#", label: "LinkedIn", glyph: "in" },
];

const LINK_GROUPS = [
  {
    title: "TRẢI NGHIỆM",
    links: ["Lưu trú riêng tư theo giờ", "Setup kỷ niệm"],
  },
  {
    title: "LA VERTE",
    links: ["Về chúng tôi", "Khu vực triển khai", "Phong cách La Verte"],
  },
  {
    title: "ĐIỂM ĐẾN",
    links: ["Bảo Lộc", "Long Khánh", "Đồng Xoài", "Đà Lạt"],
  },
  {
    title: "CHÍNH SÁCH",
    links: ["Chính sách bảo mật", "Xác minh khách", "An toàn lưu trú"],
  },
];

export const SiteFooter: FC = () => {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top">
        <div>
          <h2>Chọn một khoảng xanh cho lần nghỉ tiếp theo</h2>
          <p>
            La Verte hiện diện tại Bảo Lộc và đang chuẩn bị những điểm đến mới
            dành cho bạn.
          </p>
          <a href="mailto:hello@laverte.vn">Liên hệ La Verte</a>
        </div>
        <div className="contact-list">
          <p>
            <span>Hotline</span>
            <strong>1900&nbsp;2208 / Zalo OA</strong>
          </p>
          <p>
            <span>Email</span>
            <strong>hello@laverte.vn</strong>
          </p>
        </div>
        <div>
          <h3>Theo dõi chúng tôi qua</h3>
          <div className="socials" aria-label="Mạng xã hội">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}>
                {s.glyph}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-links">
        {LINK_GROUPS.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map((link) => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <p className="copyright">
        © CÔNG TY CỔ PHẦN LA VERTE. Giao diện website ý tưởng.
      </p>
    </footer>
  );
};
