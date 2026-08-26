"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import NextLink from "next/link";

import { ArrowRight } from "@/assets/icons/arrow-right";
import PhilosophyChamLaiImg from "@/assets/imgs/home/philosophy-cham-lai.webp";
import PhilosophyDiuDangImg from "@/assets/imgs/collection/Thumb_Di_u_Da_ng.webp";
import PhilosophyKhoQuenImg from "@/assets/imgs/collection/Thumb_Kho__Que_n.webp";
import PhilosophyTinhTeImg from "@/assets/imgs/collection/Thumb_Tinh_Te.webp";
import { Button } from "@/components/atoms/button";
import { HOME_COPY, HOME_PHILOSOPHY_CARDS } from "@/constants/home";
import { PATH } from "@/constants/path";
import { cn } from "@/utils/common";

const philosophyImages = [
  PhilosophyChamLaiImg,
  PhilosophyKhoQuenImg,
  PhilosophyTinhTeImg,
  PhilosophyDiuDangImg,
] as const;

const MOBILE_CAROUSEL_PEEK_PX = 24;
const MOBILE_CAROUSEL_INITIAL_PAGE = 1;
const DESKTOP_CAROUSEL_MEDIA = "(min-width: 1024px)";

const getScrollBehavior = (): ScrollBehavior => {
  if (typeof window === "undefined") return "smooth";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "instant"
    : "smooth";
};

const isDesktopCarousel = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia(DESKTOP_CAROUSEL_MEDIA).matches;
};

const getMobilePageScrollLeft = (
  scroller: HTMLElement,
  pageIndex: number
): number => {
  const cards = scroller.querySelectorAll<HTMLElement>("[data-carousel-card]");
  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);

  if (pageIndex <= 0) return 0;
  if (pageIndex >= cards.length - 2) return maxScroll;

  const anchorCard = cards[pageIndex];
  if (!anchorCard) return 0;

  return Math.max(
    0,
    Math.min(anchorCard.offsetLeft - MOBILE_CAROUSEL_PEEK_PX, maxScroll)
  );
};

const getNearestMobilePageIndex = (scroller: HTMLElement): number => {
  const pageCount = HOME_PHILOSOPHY_CARDS.length - 1;
  const scrollLeft = scroller.scrollLeft;
  let nearestPage = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const pageScrollLeft = getMobilePageScrollLeft(scroller, pageIndex);
    const distance = Math.abs(scrollLeft - pageScrollLeft);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestPage = pageIndex;
    }
  }

  return nearestPage;
};

export const PhilosophyCarousel = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const snapTimeoutRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(
    HOME_PHILOSOPHY_CARDS.length > 1
  );

  const applyMobileInitialScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || isDesktopCarousel()) return;

    scroller.scrollLeft = getMobilePageScrollLeft(
      scroller,
      MOBILE_CAROUSEL_INITIAL_PAGE
    );
  }, []);

  const syncFromScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = scroller.querySelectorAll<HTMLElement>(
      "[data-carousel-card]"
    );
    if (!cards.length) return;

    if (!isDesktopCarousel()) {
      const pageIndex = getNearestMobilePageIndex(scroller);
      setActiveIndex(pageIndex + 1);
      setCanScrollNext(pageIndex < HOME_PHILOSOPHY_CARDS.length - 2);
      return;
    }

    const scrollLeft = scroller.scrollLeft;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveIndex(nearestIndex);
    setCanScrollNext(nearestIndex < HOME_PHILOSOPHY_CARDS.length - 1);
  }, []);

  const snapMobileCarousel = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || isDesktopCarousel()) return;

    const pageIndex = getNearestMobilePageIndex(scroller);
    scroller.scrollTo({
      left: getMobilePageScrollLeft(scroller, pageIndex),
      behavior: getScrollBehavior(),
    });
    syncFromScroll();
  }, [syncFromScroll]);

  useLayoutEffect(() => {
    applyMobileInitialScroll();
    syncFromScroll();
  }, [applyMobileInitialScroll, syncFromScroll]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      syncFromScroll();

      if (isDesktopCarousel()) return;

      if (snapTimeoutRef.current !== null) {
        window.clearTimeout(snapTimeoutRef.current);
      }

      snapTimeoutRef.current = window.setTimeout(() => {
        snapMobileCarousel();
        snapTimeoutRef.current = null;
      }, 120);
    };

    const handleResize = () => {
      const scrollerEl = scrollerRef.current;
      if (scrollerEl && !isDesktopCarousel()) {
        const pageIndex = getNearestMobilePageIndex(scrollerEl);
        scrollerEl.scrollLeft = getMobilePageScrollLeft(scrollerEl, pageIndex);
      }
      syncFromScroll();
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (snapTimeoutRef.current !== null) {
        window.clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [applyMobileInitialScroll, snapMobileCarousel, syncFromScroll]);

  const scrollToIndex = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const clamped = Math.max(
      0,
      Math.min(index, HOME_PHILOSOPHY_CARDS.length - 1)
    );
    const card = scroller.querySelector<HTMLElement>(
      `[data-carousel-card][data-index="${clamped}"]`
    );

    if (!card) return;

    scroller.scrollTo({
      left: card.offsetLeft,
      behavior: getScrollBehavior(),
    });

    setActiveIndex(clamped);
    setCanScrollNext(clamped < HOME_PHILOSOPHY_CARDS.length - 1);
  }, []);

  const scrollNext = () => {
    scrollToIndex(activeIndex + 1);
  };

  const copy = HOME_COPY.philosophy;

  return (
    <section className="border-primary bg-background-2 overflow-x-hidden border-b">
      <div className="flex flex-col gap-10 px-5 pt-[60px] pb-20 md:px-10 lg:grid lg:grid-cols-10 lg:items-stretch lg:gap-0 lg:py-0 lg:pr-0 lg:pl-[40px]">
        <div className="flex w-full flex-col items-center gap-10 self-center lg:col-span-4 lg:justify-center lg:self-stretch lg:pr-[20px]">
          <div className="text-primary font-playfair flex w-full flex-col gap-0.5 text-center text-[22px] leading-[1.25] font-normal tracking-[-0.44px] lg:gap-2 lg:text-[2rem] lg:tracking-[-0.02em]">
            <div className="flex flex-col gap-0.5">
              <p className="m-0 w-full">{copy.line1a}</p>
              {/* <p className="m-0 w-full">{copy.line1b}</p> */}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="m-0 w-full">{copy.line2a}</p>
              <p className="m-0 w-full">
                <span className="text-secondary font-medium italic">
                  {copy.leadEmphasis}
                </span>{" "}
                {copy.leadAfter}
              </p>
            </div>
          </div>

          <NextLink
            href={PATH.quizzes.doing.vi}
            className="hidden w-fit lg:inline-flex"
          >
            <Button
              variant="outline"
              className="min-h-10 px-5 py-2.5 text-base"
            >
              {copy.cta}
            </Button>
          </NextLink>
        </div>

        <div className="flex min-w-0 flex-1 flex-col lg:col-span-6 lg:col-start-5 lg:pt-[60px] lg:pb-20">
          <div className="mb-5 hidden h-5 items-center justify-start gap-4 lg:flex">
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Xem trạng thái tiếp theo"
              className={cn(
                "text-primary flex min-h-5 min-w-[72px] shrink-0 cursor-pointer items-center justify-start transition-opacity duration-200",
                "hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30",
                "motion-reduce:transition-none"
              )}
            >
              <ArrowRight className="h-3 w-16" aria-hidden />
            </button>
          </div>

          <div
            className={cn(
              "relative left-1/2 w-screen max-w-none shrink-0 -translate-x-1/2",
              "lg:static lg:w-full lg:max-w-none lg:translate-x-0"
            )}
          >
            <div
              ref={scrollerRef}
              className={cn(
                "flex gap-4 overflow-x-auto overscroll-x-contain pb-2",
                "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
                "lg:snap-x lg:snap-mandatory lg:px-0"
              )}
            >
              {HOME_PHILOSOPHY_CARDS.map((card, index) => (
                <article
                  key={card.title}
                  data-carousel-card
                  data-index={index}
                  className="w-[calc((100vw-64px)/2)] shrink-0 lg:w-[300px] lg:snap-start lg:snap-always"
                >
                  <div className="relative h-[200px] w-full overflow-hidden lg:h-[450px]">
                    <Image
                      src={philosophyImages[index]}
                      alt={card.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1023px) 42vw, 300px"
                    />
                    <p className="text-primary font-montserrat absolute inset-0 flex items-center justify-center px-2.5 text-center text-[13px] leading-[1.3] font-normal tracking-[0.13px] mix-blend-plus-lighter lg:hidden">
                      {card.body}
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2 pt-2 lg:pt-4">
                    <h3
                      className={cn(
                        "text-primary font-montserrat text-center text-[16px] leading-[1.3] font-medium tracking-normal",
                        "lg:font-playfair lg:text-left lg:text-[25px] lg:leading-[1.25] lg:font-normal lg:tracking-[-0.02em]"
                      )}
                    >
                      {card.title}
                    </h3>
                    <p className="text-gray font-montserrat hidden text-[17px] leading-[1.3] font-normal lg:block">
                      {card.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center lg:hidden">
            <NextLink href={PATH.quizzes.doing.vi} className="w-fit">
              <Button
                variant="dark-brown"
                className="min-h-10 px-6 py-2.5 text-base leading-[0.9] text-white"
              >
                {copy.cta}
              </Button>
            </NextLink>
          </div>
        </div>
      </div>
    </section>
  );
};
