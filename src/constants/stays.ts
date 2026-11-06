// No imports on purpose: `npm test` loads this file straight into Node,
// which can't resolve the `@/` alias.

export type AreaKey = "bao-loc" | "dong-xoai" | "long-khanh" | "da-lat";

export type Area = {
  key: AreaKey;
  name: string;
  region: string;
  img: string;
  alt: string;
  desc: string;
};

export type Stay = {
  key: string;
  area: AreaKey;
  name: string;
  price: string;
  img: string;
  alt: string;
  // The API home this marketing stay sells. Unset until the owner maps them:
  // the named stays don't exist in /homes yet.
  homeId?: number;
};

export const AREAS: Area[] = [
  {
    key: "bao-loc",
    img: "/images/bao-loc-nui.jpg",
    alt: "Núi và biển mây tại Bảo Lộc, Lâm Đồng",
    region: "Lâm Đồng",
    name: "Bảo Lộc",
    desc: "Không khí cao nguyên dịu mát, những đồi trà xanh và nhịp sống chậm vừa đủ cho một kỳ nghỉ ngắn.",
  },
  {
    key: "long-khanh",
    img: "/images/long-khanh-clean.png",
    alt: "Không gian xanh tại Long Khánh, Đồng Nai",
    region: "Đồng Nai",
    name: "Long Khánh",
    desc: "Miền vườn xanh mát, yên bình và gần gũi, phù hợp cho những ngày muốn tạm rời nhịp sống vội.",
  },
  {
    key: "dong-xoai",
    img: "/images/dong-xoai-tuong-dai.jpg",
    alt: "Tượng đài chiến thắng Đồng Xoài, Bình Phước",
    region: "Bình Phước",
    name: "Đồng Xoài",
    desc: "Một điểm dừng mới trẻ trung, thuận tiện để nghỉ ngơi và khám phá nhịp sống đặc trưng của Bình Phước.",
  },
];

export const AREA_FILTERS: { key: AreaKey; label: string }[] = [
  { key: "bao-loc", label: "Bảo Lộc" },
  { key: "dong-xoai", label: "Đồng Xoài" },
  { key: "long-khanh", label: "Long Khánh" },
  { key: "da-lat", label: "Đà Lạt" },
];

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=82`;

export const STAYS: Stay[] = [
  {
    key: "may-trang",
    area: "bao-loc",
    name: "La Verte Mây Trắng",
    price: "149.000đ/h",
    img: "/images/home-hero.jpg",
    alt: "Không gian La Verte Home 2 tại Bảo Lộc",
  },
  {
    key: "doi-thong",
    area: "bao-loc",
    name: "La Verte Đồi Thông",
    price: "129.000đ/h",
    img: "/images/nest-1-bedroom.jpg",
    alt: "Phòng ngủ La Verte Nest 1 tại Bảo Lộc",
  },
  {
    key: "suoi-mo",
    area: "bao-loc",
    name: "La Verte Suối Mơ",
    price: "119.000đ/h",
    img: "/images/nest-1-living.jpg",
    alt: "Phòng khách La Verte tại Bảo Lộc",
  },
  {
    key: "the-nest",
    area: "bao-loc",
    name: "La Verte The Nest",
    price: "139.000đ/h",
    img: "/images/home-2-bedroom.jpg",
    alt: "Phòng ngủ La Verte tại Bảo Lộc",
  },
  {
    key: "vuon-an",
    area: "bao-loc",
    name: "La Verte Vườn An",
    price: "159.000đ/h",
    img: "/images/nest-1-kitchen.jpg",
    alt: "Góc bếp La Verte tại Bảo Lộc",
  },
  {
    key: "cham-xanh",
    area: "bao-loc",
    name: "La Verte Chạm Xanh",
    price: "169.000đ/h",
    img: "/images/nest-1-lounge.jpg",
    alt: "Góc lounge La Verte tại Bảo Lộc",
  },
  {
    key: "binh-minh",
    area: "dong-xoai",
    name: "La Verte Bình Minh",
    price: "149.000đ/h",
    img: U("photo-1600585154340-be6161a56a0c"),
    alt: "Không gian nhà vườn La Verte Đồng Xoài",
  },
  {
    key: "pho-xanh",
    area: "dong-xoai",
    name: "La Verte Phố Xanh",
    price: "139.000đ/h",
    img: U("photo-1618220179428-22790b461013"),
    alt: "Phòng ngủ ấm cúng La Verte Đồng Xoài",
  },
  {
    key: "the-olive",
    area: "dong-xoai",
    name: "La Verte The Olive",
    price: "119.000đ/h",
    img: U("photo-1600210492493-0946911123ea"),
    alt: "Phòng khách sáng và xanh của La Verte Đồng Xoài",
  },
  {
    key: "gardenia",
    area: "dong-xoai",
    name: "La Verte Gardenia",
    price: "129.000đ/h",
    img: U("photo-1750271329214-a7dbce880e85"),
    alt: "Không gian nghỉ dưỡng xanh La Verte Đồng Xoài",
  },
  {
    key: "lang-yen",
    area: "dong-xoai",
    name: "La Verte Lặng Yên",
    price: "159.000đ/h",
    img: U("photo-1774280960001-ce8169cfc38f"),
    alt: "Villa xanh riêng tư La Verte Đồng Xoài",
  },
  {
    key: "dau-nang",
    area: "dong-xoai",
    name: "La Verte Dấu Nắng",
    price: "169.000đ/h",
    img: U("photo-1784730369371-0ae6a3a8d153"),
    alt: "Retreat riêng tư La Verte Đồng Xoài",
  },
  {
    key: "orchard",
    area: "long-khanh",
    name: "La Verte Orchard",
    price: "149.000đ/h",
    img: U("photo-1600566753190-17f0baa2a6c3"),
    alt: "Nhà vườn hiện đại La Verte Long Khánh",
  },
  {
    key: "vuon-mua",
    area: "long-khanh",
    name: "La Verte Vườn Mưa",
    price: "139.000đ/h",
    img: U("photo-1600607687939-ce8a6c25118c"),
    alt: "Phòng khách mở La Verte Long Khánh",
  },
  {
    key: "the-grove",
    area: "long-khanh",
    name: "La Verte The Grove",
    price: "129.000đ/h",
    img: U("photo-1600607687920-4e2a09cf159d"),
    alt: "Không gian sinh hoạt La Verte Long Khánh",
  },
  {
    key: "camellia",
    area: "long-khanh",
    name: "La Verte Camellia",
    price: "119.000đ/h",
    img: U("photo-1600566752355-35792bedcfea"),
    alt: "Villa sân vườn La Verte Long Khánh",
  },
  {
    key: "san-vuon",
    area: "long-khanh",
    name: "La Verte Sân Vườn",
    price: "159.000đ/h",
    img: U("photo-1600607687644-aac4c3eac7f4"),
    alt: "Nội thất tinh gọn La Verte Long Khánh",
  },
  {
    key: "moc-mien",
    area: "long-khanh",
    name: "La Verte Mộc Miên",
    price: "169.000đ/h",
    img: U("photo-1600585153490-76fb20a32601"),
    alt: "Không gian nghỉ dưỡng La Verte Long Khánh",
  },
  {
    key: "pine-hill",
    area: "da-lat",
    name: "La Verte Pine Hill",
    price: "189.000đ/h",
    img: U("photo-1616594039964-ae9021a400a0"),
    alt: "Phòng ngủ ấm áp La Verte Đà Lạt",
  },
  {
    key: "suong-mai",
    area: "da-lat",
    name: "La Verte Sương Mai",
    price: "179.000đ/h",
    img: U("photo-1595526114035-0d45ed16cfbf"),
    alt: "Phòng ngủ boutique La Verte Đà Lạt",
  },
  {
    key: "the-loft",
    area: "da-lat",
    name: "La Verte The Loft",
    price: "159.000đ/h",
    img: U("photo-1618221118493-9cfa1a1c00da"),
    alt: "Góc nghỉ yên tĩnh La Verte Đà Lạt",
  },
  {
    key: "moonlight",
    area: "da-lat",
    name: "La Verte Moonlight",
    price: "149.000đ/h",
    img: U("photo-1615873968403-89e068629265"),
    alt: "Không gian riêng tư La Verte Đà Lạt",
  },
  {
    key: "hoa-ban",
    area: "da-lat",
    name: "La Verte Hoa Ban",
    price: "139.000đ/h",
    img: U("photo-1616486338812-3dadae4b4ace"),
    alt: "Nội thất nhẹ nhàng La Verte Đà Lạt",
  },
  {
    key: "cloud-nine",
    area: "da-lat",
    name: "La Verte Cloud Nine",
    price: "129.000đ/h",
    img: U("photo-1600210492486-724fe5c67fb0"),
    alt: "Căn hộ sáng ấm La Verte Đà Lạt",
  },
];

// Areas paused for now. Mobile only — the desktop site keeps listing every
// place until it is redesigned. Add a key back to reopen it on phones.
export const ACTIVE_AREAS: AreaKey[] = ["bao-loc"];

export const MOBILE_AREAS = AREAS.filter((a) => ACTIVE_AREAS.includes(a.key));
export const MOBILE_FILTERS = AREA_FILTERS.filter((f) =>
  ACTIVE_AREAS.includes(f.key)
);
export const MOBILE_STAYS = STAYS.filter((s) => ACTIVE_AREAS.includes(s.area));

export const findStay = (key: string | null | undefined): Stay | undefined =>
  key ? STAYS.find((s) => s.key === key) : undefined;

export const stayBookHref = (stay: Stay): string =>
  `/book?stay=${stay.key}${stay.homeId ? `&home=${stay.homeId}` : ""}`;

export const CONTACT = {
  hotline: "1900 2208",
  tel: "19002208",
  email: "hello@laverte.vn",
} as const;
