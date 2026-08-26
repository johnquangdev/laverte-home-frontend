"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";

import HeroImg from "@/assets/imgs/home/banner-home.webp";
import { Link } from "@/components/atoms/link";
import { DialogClose } from "@/components/ui/dialog";
import { PATH } from "@/constants/path";
import { cn } from "@/utils/common";

const menuLinkClass =
  "text-beige text-center transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-beige";

const menuLabelClass =
  "font-montserrat text-center text-[1.6rem] leading-[1.2] font-medium tracking-[-0.02em] sm:text-[20px] md:text-[2rem] lg:text-[32px] lg:font-normal lg:leading-[1.2]";

const primaryLinks: {
  href: string;
  label: string;
}[] = [
  { href: PATH.home, label: "Trang Chủ" },
  { href: PATH.quizzes.vi, label: "Tìm một khoảng riêng" },
  { href: PATH.about.vi, label: "Về La Verte" },
  { href: PATH.recruitment.vi, label: "Tuyển dụng" },
  { href: PATH.blogs.vi, label: "Bài viết" },
];

type Props = {
  onNavigate?: () => void;
};

export const HeaderMenuContent = ({ onNavigate }: Props) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => setIsAnimated(true));
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, []);

  return (
    <div className="text-beige relative flex h-[calc(100vh-52px)] flex-1 flex-col overflow-hidden bg-black">
      <Image
        src={HeroImg}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
        quality={90}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.80)]" aria-hidden />

      <div
        className={cn(
          "relative z-10 flex min-h-0 flex-1 flex-col will-change-transform",
          isAnimated
            ? "translate-y-0 transition-transform duration-300 ease-out"
            : "translate-y-2 lg:translate-y-2"
        )}
      >
        <DialogClose asChild>
          <button
            type="button"
            aria-label="Đóng điều hướng"
            className="text-beige absolute top-8 right-8 z-10 cursor-pointer p-2 transition-opacity hover:opacity-80 md:top-10 md:right-10"
          >
            <XIcon className="stroke-[1.25]" width={35} height={42} />
          </button>
        </DialogClose>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex w-full max-w-[min(90vw,400px)] flex-col items-stretch">
            <div
              className="bg-beige hidden h-px shrink-0 opacity-90 lg:block"
              aria-hidden
            />
            <nav
              className="flex w-full flex-col items-center gap-[20px] py-[20px]"
              aria-label="Chính"
            >
              {primaryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={menuLinkClass}
                >
                  <p className={menuLabelClass}>{item.label}</p>
                </Link>
              ))}
            </nav>
            <div
              className="bg-beige hidden h-px w-full shrink-0 opacity-90 lg:block"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
};
