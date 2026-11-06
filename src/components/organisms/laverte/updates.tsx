import type { FC } from "react";

import { AREAS } from "@/constants/stays";

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
