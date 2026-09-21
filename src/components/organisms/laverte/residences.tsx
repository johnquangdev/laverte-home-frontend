"use client";

import { type FC, useState } from "react";
import Link from "next/link";

type Stay = {
  name: string;
  price: string;
  img: string;
  alt: string;
  location: string;
};

const FILTERS = [
  { key: "bao-loc", label: "Bảo Lộc" },
  { key: "dong-xoai", label: "Đồng Xoài" },
  { key: "long-khanh", label: "Long Khánh" },
  { key: "da-lat", label: "Đà Lạt" },
];

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=82`;

const STAYS: Stay[] = [
  {
    location: "bao-loc",
    name: "La Verte Mây Trắng",
    price: "149.000đ/h",
    img: "/images/home-hero.jpg",
    alt: "Không gian La Verte Home 2 tại Bảo Lộc",
  },
  {
    location: "bao-loc",
    name: "La Verte Đồi Thông",
    price: "129.000đ/h",
    img: "/images/nest-1-bedroom.jpg",
    alt: "Phòng ngủ La Verte Nest 1 tại Bảo Lộc",
  },
  {
    location: "bao-loc",
    name: "La Verte Suối Mơ",
    price: "119.000đ/h",
    img: "/images/nest-1-living.jpg",
    alt: "Phòng khách La Verte tại Bảo Lộc",
  },
  {
    location: "bao-loc",
    name: "La Verte The Nest",
    price: "139.000đ/h",
    img: "/images/home-2-bedroom.jpg",
    alt: "Phòng ngủ La Verte tại Bảo Lộc",
  },
  {
    location: "bao-loc",
    name: "La Verte Vườn An",
    price: "159.000đ/h",
    img: "/images/nest-1-kitchen.jpg",
    alt: "Góc bếp La Verte tại Bảo Lộc",
  },
  {
    location: "bao-loc",
    name: "La Verte Chạm Xanh",
    price: "169.000đ/h",
    img: "/images/nest-1-lounge.jpg",
    alt: "Góc lounge La Verte tại Bảo Lộc",
  },
  {
    location: "dong-xoai",
    name: "La Verte Bình Minh",
    price: "149.000đ/h",
    img: U("photo-1600585154340-be6161a56a0c"),
    alt: "Không gian nhà vườn La Verte Đồng Xoài",
  },
  {
    location: "dong-xoai",
    name: "La Verte Phố Xanh",
    price: "139.000đ/h",
    img: U("photo-1618220179428-22790b461013"),
    alt: "Phòng ngủ ấm cúng La Verte Đồng Xoài",
  },
  {
    location: "dong-xoai",
    name: "La Verte The Olive",
    price: "119.000đ/h",
    img: U("photo-1600210492493-0946911123ea"),
    alt: "Phòng khách sáng và xanh của La Verte Đồng Xoài",
  },
  {
    location: "dong-xoai",
    name: "La Verte Gardenia",
    price: "129.000đ/h",
    img: U("photo-1750271329214-a7dbce880e85"),
    alt: "Không gian nghỉ dưỡng xanh La Verte Đồng Xoài",
  },
  {
    location: "dong-xoai",
    name: "La Verte Lặng Yên",
    price: "159.000đ/h",
    img: U("photo-1774280960001-ce8169cfc38f"),
    alt: "Villa xanh riêng tư La Verte Đồng Xoài",
  },
  {
    location: "dong-xoai",
    name: "La Verte Dấu Nắng",
    price: "169.000đ/h",
    img: U("photo-1784730369371-0ae6a3a8d153"),
    alt: "Retreat riêng tư La Verte Đồng Xoài",
  },
  {
    location: "long-khanh",
    name: "La Verte Orchard",
    price: "149.000đ/h",
    img: U("photo-1600566753190-17f0baa2a6c3"),
    alt: "Nhà vườn hiện đại La Verte Long Khánh",
  },
  {
    location: "long-khanh",
    name: "La Verte Vườn Mưa",
    price: "139.000đ/h",
    img: U("photo-1600607687939-ce8a6c25118c"),
    alt: "Phòng khách mở La Verte Long Khánh",
  },
  {
    location: "long-khanh",
    name: "La Verte The Grove",
    price: "129.000đ/h",
    img: U("photo-1600607687920-4e2a09cf159d"),
    alt: "Không gian sinh hoạt La Verte Long Khánh",
  },
  {
    location: "long-khanh",
    name: "La Verte Camellia",
    price: "119.000đ/h",
    img: U("photo-1600566752355-35792bedcfea"),
    alt: "Villa sân vườn La Verte Long Khánh",
  },
  {
    location: "long-khanh",
    name: "La Verte Sân Vườn",
    price: "159.000đ/h",
    img: U("photo-1600607687644-aac4c3eac7f4"),
    alt: "Nội thất tinh gọn La Verte Long Khánh",
  },
  {
    location: "long-khanh",
    name: "La Verte Mộc Miên",
    price: "169.000đ/h",
    img: U("photo-1600585153490-76fb20a32601"),
    alt: "Không gian nghỉ dưỡng La Verte Long Khánh",
  },
  {
    location: "da-lat",
    name: "La Verte Pine Hill",
    price: "189.000đ/h",
    img: U("photo-1616594039964-ae9021a400a0"),
    alt: "Phòng ngủ ấm áp La Verte Đà Lạt",
  },
  {
    location: "da-lat",
    name: "La Verte Sương Mai",
    price: "179.000đ/h",
    img: U("photo-1595526114035-0d45ed16cfbf"),
    alt: "Phòng ngủ boutique La Verte Đà Lạt",
  },
  {
    location: "da-lat",
    name: "La Verte The Loft",
    price: "159.000đ/h",
    img: U("photo-1618221118493-9cfa1a1c00da"),
    alt: "Góc nghỉ yên tĩnh La Verte Đà Lạt",
  },
  {
    location: "da-lat",
    name: "La Verte Moonlight",
    price: "149.000đ/h",
    img: U("photo-1615873968403-89e068629265"),
    alt: "Không gian riêng tư La Verte Đà Lạt",
  },
  {
    location: "da-lat",
    name: "La Verte Hoa Ban",
    price: "139.000đ/h",
    img: U("photo-1616486338812-3dadae4b4ace"),
    alt: "Nội thất nhẹ nhàng La Verte Đà Lạt",
  },
  {
    location: "da-lat",
    name: "La Verte Cloud Nine",
    price: "129.000đ/h",
    img: U("photo-1600210492486-724fe5c67fb0"),
    alt: "Căn hộ sáng ấm La Verte Đà Lạt",
  },
];

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
            className={`stay-card${stay.location !== active ? " is-hidden" : ""}`}
            data-location={stay.location}
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
