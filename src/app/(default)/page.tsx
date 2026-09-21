import type { Metadata } from "next";

import { Hero } from "@/components/organisms/laverte/hero";
import { Membership } from "@/components/organisms/laverte/membership";
import { Residences } from "@/components/organisms/laverte/residences";
import { Updates } from "@/components/organisms/laverte/updates";

export const metadata: Metadata = {
  title: "La Verte | Lưu trú riêng tư theo giờ",
  description:
    "La Verte - lưu trú riêng tư theo giờ với không gian nhà/villa sạch, đẹp, kín đáo và linh hoạt tại các thành phố đang phát triển.",
};

const Home = () => {
  return (
    <>
      <Hero />
      <Updates />
      <Residences />
      <Membership />
    </>
  );
};

export default Home;
