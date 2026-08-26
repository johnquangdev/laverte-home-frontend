import { Logo } from "@/assets/logo";
import { Container } from "@/components/atoms/container";
import { Link } from "@/components/atoms/link";
import { INFO } from "@/constants/info";
import { PATH } from "@/constants/path";

const footerLinkClass =
  "font-montserrat text-primary text-[15px] leading-[1.4] font-normal tracking-[-0.01em] transition-colors hover:text-secondary";

const footerHeadingClass =
  "font-montserrat text-primary text-[15px] leading-[1.4] font-bold tracking-[-0.01em] lg:text-[17px] lg:leading-[1.2] lg:font-semibold";

export const Footer = () => {
  return (
    <footer className="bg-beige text-primary w-full">
      <Container className="max-w-[1280px] px-5 py-10 md:px-10 lg:px-[30px] lg:py-[60px]">
        <div className="flex flex-col gap-10 lg:items-end">
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-end lg:gap-20">
            <Link
              href={PATH.home}
              className="block shrink-0"
              aria-label="La Verte Home"
            >
              <Logo className="text-primary h-auto w-[161px] lg:w-[201px]" />
            </Link>

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[277px_201px_192px_auto] lg:justify-between lg:gap-8 lg:pt-2 lg:pr-20">
              <section className="flex flex-col gap-3">
                <h2 className={footerHeadingClass}>Thông tin homestay</h2>
                <div className="flex flex-col gap-2 lg:gap-2.5">
                  <p className={footerLinkClass}>{INFO.address}</p>
                  <Link href={`tel:${INFO.phone}`} className={footerLinkClass}>
                    {INFO.formattedPhone}
                  </Link>
                  <Link
                    href={`mailto:${INFO.email}`}
                    className={footerLinkClass}
                  >
                    {INFO.email}
                  </Link>
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h2 className={footerHeadingClass}>Khám phá</h2>
                <nav className="flex flex-col gap-2 lg:gap-2.5">
                  <Link
                    href={PATH.quizzes.doing.vi}
                    className={footerLinkClass}
                  >
                    Tìm một khoảng riêng
                  </Link>
                  <Link href={PATH.about.vi} className={footerLinkClass}>
                    Về La Verte
                  </Link>
                  <Link href={PATH.recruitment.vi} className={footerLinkClass}>
                    Tuyển dụng
                  </Link>

                  <Link href={PATH.blogs.vi} className={footerLinkClass}>
                    Bài viết
                  </Link>
                </nav>
              </section>

              <section className="flex flex-col gap-3"></section>

              <nav className="flex flex-col gap-3">
                <Link
                  href="https://www.facebook.com/nuochoaguscentdanang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerHeadingClass}
                >
                  Fanpage
                </Link>
                <Link
                  href="https://www.instagram.com/guscent.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerHeadingClass}
                >
                  Instagram
                </Link>
                <Link
                  href="https://www.tiktok.com/@guscentvn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerHeadingClass}
                >
                  Tiktok
                </Link>
                <Link href={INFO.zaloLink} className={footerHeadingClass}>
                  Zalo OA
                </Link>
              </nav>
            </div>
          </div>

          <p className="text-gray font-montserrat w-full text-center text-[12px] leading-[1.4] font-light tracking-[-0.03em] lg:text-[13px] lg:leading-[1.3] lg:font-normal lg:tracking-[0.01em]">
            Copyright © {new Date().getFullYear()} La Verte Home. Designed and
            Developed by john.Quang
          </p>
        </div>
      </Container>
    </footer>
  );
};
