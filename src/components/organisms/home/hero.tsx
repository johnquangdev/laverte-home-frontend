"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";

import HeroBg from "@/assets/imgs/home/banner-home.webp";
import logo from "@/assets/imgs/logo.png";
import { ArrowDown } from "@/components/atoms/ArrrowDown";
import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { HOME_COPY } from "@/constants/home";
import { cn } from "@/utils/common";

/** Hero wordmark — dùng trực tiếp `logo.png` từ design. */
const LOGO_WIDTH = 2201;
const LOGO_HEIGHT = 714;
const heroContainerClass =
  "relative z-10 flex h-full w-full max-w-none flex-col justify-end gap-4 pt-[calc(env(safe-area-inset-top,0px)+56px+1.5rem)] pb-2 lg:grid lg:grid-cols-10 lg:content-end lg:items-end lg:gap-x-0 lg:gap-y-0 lg:gap-5 lg:pt-[90px] lg:pb-3";

const mobileCtaButtonClass =
  "font-montserrat h-fit min-h-0 max-w-[150px] px-0 py-0 text-[13px] leading-[1.4] font-normal tracking-[-0.15px] whitespace-normal";

const desktopCtaButtonClass =
  "lg:border-beige lg:mr-[35px] lg:h-fit lg:w-full lg:max-w-none lg:justify-center lg:rounded-full lg:border-[1.6px] lg:bg-transparent lg:px-[16px] lg:py-2.5 lg:text-center lg:whitespace-nowrap lg:hover:bg-white/10";

export const HomeHero = () => {
  const handleScroll = useCallback(() => {
    document
      .getElementById("philosophy-carousel")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    setAppHeight();

    window.addEventListener("orientationchange", setAppHeight);

    return () => {
      window.removeEventListener("orientationchange", setAppHeight);
    };
  }, []);

  return (
    <section className="relative h-(--app-height) w-full overflow-hidden lg:h-dvh">
      <Image
        src={HeroBg}
        alt=""
        fill
        priority
        className="object-cover max-lg:object-[86%_34%] lg:object-center"
        sizes="100vw"
        quality={90}
        aria-hidden
      />
      {/* Phủ tối hơn — đáy đậm cho chữ, phía trên vẫn thấy ảnh */}
      <div className="absolute inset-0 bg-black/32" aria-hidden />
      <div
        className="absolute inset-0 bg-linear-to-t from-black/95 from-0% via-black/70 via-24% via-black/30 via-42% to-transparent to-58%"
        aria-hidden
      />
      <Container className={heroContainerClass}>
        <div className="flex w-full flex-col gap-4 lg:contents">
          <h1 className="m-0 min-w-0 w-full leading-none lg:col-span-7 lg:col-start-1 lg:self-end">
            <Image
              src={logo}
              alt={HOME_COPY.hero.wordmark}
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              priority
              quality={100}
              sizes="50vw"
              className="h-auto w-full max-w-[50vw] object-contain object-left-bottom"
            />
          </h1>
          <div className="flex w-full flex-col gap-4 lg:col-span-3 lg:col-start-8 lg:max-w-none lg:items-start lg:justify-self-end lg:self-end lg:gap-[20px]">
            <div className="text-beige font-playfair font-regular w-full max-w-[349px] text-left text-[20px] wrap-break-word whitespace-normal drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:text-[25px] lg:max-w-none">
              <p className="mb-0">
                Một chút chậm. Một{" "}
                <span className="text-secondary font-medium italic">
                  khoảng riêng
                </span>
                .
              </p>
              <p className="mb-0">{HOME_COPY.hero.taglineLine2}</p>
            </div>
            <Button
              variant="text-beige"
              className={cn("hidden lg:inline-flex", desktopCtaButtonClass)}
              onClick={handleScroll}
            >
              {HOME_COPY.hero.cta}
            </Button>
          </div>
        </div>
        <div className="flex w-full items-end justify-end gap-4 lg:hidden">
          <Button
            variant="text-beige"
            className={cn(
              mobileCtaButtonClass,
              "w-auto max-w-[140px] justify-end text-right"
            )}
            onClick={handleScroll}
          >
            {HOME_COPY.hero.cta}
          </Button>
          <button
            type="button"
            aria-label="Cuộn xuống phần tiếp theo"
            className={cn(
              "text-beige @container-[size] flex w-6 shrink-0 cursor-pointer items-center justify-center transition-opacity duration-200",
              "hover:opacity-70",
              "motion-reduce:transition-none"
            )}
            onClick={handleScroll}
          >
            <ArrowDown
              className="block h-[100cqh] w-auto shrink-0"
              aria-hidden
            />
          </button>
        </div>
      </Container>
    </section>
  );
};
