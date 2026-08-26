"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Logo } from "@/assets/logo";
import { Container } from "@/components/atoms/container";
import { Link } from "@/components/atoms/link";
import { MenuIcon } from "@/components/atoms/menu-icon";
import { HeaderMenuContent } from "@/components/organisms/common/header-menu-content";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HOME_COPY } from "@/constants/home";
import { PATH } from "@/constants/path";
import { useHeaderVisibility } from "@/hooks/header-visibility";
import { cn } from "@/utils/common";

const desktopHeaderContainerClass =
  "grid min-h-[90px] w-full max-w-none grid-cols-10 items-center";

const headerThemeTransitionClass =
  "transition-[background-color,color,border-color,opacity,backdrop-filter] duration-1000 ease-out";

const lightChromeColorClass = "text-primary";

const headerShowMotionClass =
  "translate-y-0 opacity-100 [transition:transform_860ms_cubic-bezier(0.16,1,0.3,1),opacity_560ms_cubic-bezier(0.16,1,0.3,1),background-color_500ms_ease-out,color_500ms_ease-out,border-color_500ms_ease-out]";

const headerHideMotionClass =
  "-translate-y-full opacity-0 [transition:transform_860ms_cubic-bezier(0.16,1,0.3,1),opacity_560ms_cubic-bezier(0.16,1,0.3,1),background-color_1000ms_ease-out,color_1000ms_ease-out,border-color_1000ms_ease-out]";

export const NewHeader = () => {
  const pathname = usePathname();
  const isHome = pathname === PATH.home;
  const isCollectionDetailRoute = PATH.isCollectionDetail(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const isVisible = useHeaderVisibility();
  const [isLightTheme, setIsLightTheme] = useState(
    !isHome && !isCollectionDetailRoute
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHome && !isCollectionDetailRoute) {
      setIsLightTheme(true);
      return;
    }

    const getHeaderHeight = () =>
      window.matchMedia("(min-width: 1024px)").matches ? 90 : 56;

    const syncThemeFromScroll = () => {
      const lightModeSection = document.getElementById(
        isHome ? "philosophy-carousel" : "collection-with-image"
      );

      if (!lightModeSection) {
        setIsLightTheme(false);
        return;
      }

      const activationPoint = lightModeSection.offsetTop - getHeaderHeight();
      setIsLightTheme(window.scrollY >= activationPoint);
    };

    syncThemeFromScroll();
    window.addEventListener("scroll", syncThemeFromScroll, {
      passive: true,
    });
    window.addEventListener("resize", syncThemeFromScroll);

    return () => {
      window.removeEventListener("scroll", syncThemeFromScroll);
      window.removeEventListener("resize", syncThemeFromScroll);
    };
  }, [isCollectionDetailRoute, isHome]);

  return (
    <>
      <header
        className={cn(
          "inset-x-0 top-0 z-50 w-full border-b [border-bottom-width:0.5px] will-change-transform motion-reduce:transition-none",
          isHome || isCollectionDetailRoute
            ? "fixed pt-[env(safe-area-inset-top,0px)]"
            : "sticky",
          isLightTheme
            ? cn(
                "border-[#7a6450]/20 bg-taskbar/70 text-primary backdrop-blur-sm",
                lightChromeColorClass
              )
            : "border-beige text-beige bg-transparent",
          menuOpen && "text-beige",
          headerThemeTransitionClass,
          isVisible ? headerShowMotionClass : headerHideMotionClass
        )}
      >
        <Container
          className={cn(
            "flex h-14 min-h-14 items-center justify-between gap-4 lg:hidden"
          )}
        >
          <Link
            href={PATH.home}
            className="flex h-full shrink-0 items-center text-inherit hover:text-inherit"
            aria-label="Trang chủ"
            onClick={() => setMenuOpen(false)}
          >
            <Logo
              className={cn(
                isLightTheme ? lightChromeColorClass : "text-beige"
              )}
            />
          </Link>

          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label="Mở điều hướng"
                className={cn(
                  "flex size-9 items-center justify-center transition-opacity hover:opacity-80",
                  isLightTheme ? lightChromeColorClass : "text-beige"
                )}
              >
                <MenuIcon />
              </button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} variant="fullscreen-menu">
              <DialogTitle className="sr-only">Điều hướng chính</DialogTitle>
              <HeaderMenuContent onNavigate={() => setMenuOpen(false)} />
            </DialogContent>
          </Dialog>
        </Container>

        <Container
          className={cn(desktopHeaderContainerClass, "hidden lg:grid")}
        >
          <Link
            href={PATH.home}
            className="col-span-1 flex shrink-0 items-center text-inherit hover:text-inherit"
            aria-label="Trang chủ"
          >
            <Logo
              className={cn(
                isLightTheme ? lightChromeColorClass : "text-beige"
              )}
            />
          </Link>
          <div className="col-span-2 col-start-9 flex items-center justify-end gap-10">
            <span className="font-montserrat text-base leading-tight font-medium whitespace-nowrap">
              {HOME_COPY.hero.estLabel}
            </span>
            <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="Mở điều hướng"
                  className={cn(
                    "flex h-[42px] w-[63px] cursor-pointer items-center justify-center transition-opacity hover:opacity-80",
                    isLightTheme ? lightChromeColorClass : "text-beige"
                  )}
                >
                  <span
                    className="flex w-[31px] flex-col gap-[11px]"
                    aria-hidden
                  >
                    <span
                      className={cn(
                        "h-0.5 w-full rounded-[1px]",
                        isLightTheme ? "bg-black" : "bg-beige"
                      )}
                    />
                    <span
                      className={cn(
                        "h-0.5 w-full rounded-[1px]",
                        isLightTheme ? "bg-black" : "bg-beige"
                      )}
                    />
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent showCloseButton={false} variant="fullscreen-menu">
                <DialogTitle className="sr-only">Điều hướng chính</DialogTitle>
                <HeaderMenuContent onNavigate={() => setMenuOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </Container>
      </header>
    </>
  );
};
