import type { FC } from "react";

export const Membership: FC = () => {
  return (
    <section
      className="membership"
      id="membership"
      aria-label="Không gian La Verte dành cho cặp đôi"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/couple-retreat-banner.png"
        alt="Không gian La Verte riêng tư dành cho cặp đôi"
        loading="lazy"
      />
    </section>
  );
};
