import type { FC } from "react";

const AREAS = [
  {
    img: "/images/bao-loc-nui.jpg",
    alt: "Núi và biển mây tại Bảo Lộc, Lâm Đồng",
    region: "Lâm Đồng",
    name: "Bảo Lộc",
    desc: "Không khí cao nguyên dịu mát, những đồi trà xanh và nhịp sống chậm vừa đủ cho một kỳ nghỉ ngắn.",
  },
  {
    img: "/images/long-khanh-clean.png",
    alt: "Không gian xanh tại Long Khánh, Đồng Nai",
    region: "Đồng Nai",
    name: "Long Khánh",
    desc: "Miền vườn xanh mát, yên bình và gần gũi, phù hợp cho những ngày muốn tạm rời nhịp sống vội.",
  },
  {
    img: "/images/dong-xoai-tuong-dai.jpg",
    alt: "Tượng đài chiến thắng Đồng Xoài, Bình Phước",
    region: "Bình Phước",
    name: "Đồng Xoài",
    desc: "Một điểm dừng mới trẻ trung, thuận tiện để nghỉ ngơi và khám phá nhịp sống đặc trưng của Bình Phước.",
  },
];

export const Updates: FC = () => {
  return (
    <section
      className="updates section-wrap"
      id="story"
      aria-labelledby="updates-title"
    >
      <div className="section-heading">
        <span>Các khu vực triển khai</span>
        <h2 id="updates-title">La Verte</h2>
      </div>

      <div className="news-grid">
        {AREAS.map((area) => (
          <article className="news-card" key={area.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={area.img} alt={area.alt} loading="lazy" />
            <div>
              <p>{area.region}</p>
              <h3>{area.name}</h3>
              <span>{area.desc}</span>
              <a href="#residences">Khám phá ↗</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
