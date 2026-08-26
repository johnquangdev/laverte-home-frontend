import Image from "next/image";

import ManifestoImg from "@/assets/imgs/home/cover-home.webp";
import { Container } from "@/components/atoms/container";
import { HOME_COPY } from "@/constants/home";
import { cn } from "@/utils/common";

const emphasisClass = "text-secondary font-medium italic";

export const HomeManifesto = () => {
  const copy = HOME_COPY.manifesto;

  return (
    <section className="relative w-full">
      <div className="relative overflow-hidden sm:h-[480px] lg:h-[630px]">
        <Image
          src={ManifestoImg}
          alt=""
          fill
          className="scale-[1.02] object-cover blur-[2px]"
          sizes="100vw"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_68%_64%_at_50%_50%,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.52)_45%,rgba(0,0,0,0.22)_100%)]"
          aria-hidden
        />
        <Container className="relative z-10 flex h-full max-w-[1280px] flex-col items-center justify-center px-10 py-20 lg:px-[40px] lg:py-[60px]">
          <div
            className={cn(
              "text-beige font-playfair max-w-[745px] text-center text-[20px] leading-tight font-normal tracking-[-0.4px]",
              "[text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_4px_18px_rgba(0,0,0,0.38)] lg:text-[2rem] lg:leading-[1.35] lg:tracking-[-0.02em]"
            )}
          >
            <p className="m-0 mb-5 lg:mb-6">
              Từ một <span className={emphasisClass}>cảm giác</span>, tìm về một
              không gian.
            </p>
            <div className="mb-5 flex flex-col gap-1 lg:mb-6 lg:gap-1.5">
              <p className="m-0">
                Có những ngày hai người muốn{" "}
                <span className={emphasisClass}>chậm lại</span>.
              </p>
              <p className="m-0">
                Có những ngày chỉ muốn nghe tiếng{" "}
                <span className={emphasisClass}>mưa ngoài hiên</span>,
              </p>
              <p className="m-0">{copy.stanza[2]}</p>
              <p className="m-0">{copy.stanza[3]}</p>
            </div>
            <div className="flex flex-col gap-1 lg:gap-1.5">
              {copy.closing.map((line) => (
                <p key={line} className="m-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};
