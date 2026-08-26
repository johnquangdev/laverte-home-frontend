import { Suspense } from "react";

import { HomeBlogPreview } from "@/components/organisms/home/blog-preview";
import { HomeHero } from "@/components/organisms/home/hero";
import { HomeManifesto } from "@/components/organisms/home/manifesto";
import { PhilosophyCarouselSection } from "@/components/organisms/home/philosophy-carousel-section";
import { PhilosophyCarouselSkeleton } from "@/components/organisms/home/skeletons/philosophy-carousel";

const Home = () => {
  return (
    <>
      <HomeHero />
      <Suspense fallback={<PhilosophyCarouselSkeleton />}>
        <PhilosophyCarouselSection />
      </Suspense>
      <HomeManifesto />
      <HomeBlogPreview />
    </>
  );
};

export default Home;
