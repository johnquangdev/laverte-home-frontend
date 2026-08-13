import type { FC } from "react";

import { HeroSection } from "@/components/organisms/home/hero-section";
import { StayTypesSection } from "@/components/organisms/home/stay-types-section";

const HomePage: FC = () => {
  return (
    <>
      <HeroSection />
      <StayTypesSection />
    </>
  );
};

export default HomePage;
