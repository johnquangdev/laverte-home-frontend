import type { FC, ReactNode } from "react";

import { GlobalConfigs } from "@/components/organisms/common/global-configs";
import { ChatButton } from "@/components/organisms/laverte/chat-button";
import { SiteFooter } from "@/components/organisms/laverte/site-footer";
import { SiteHeader } from "@/components/organisms/laverte/site-header";
import { MobileFooter } from "@/components/organisms/mobile/footer";
import { MobileTopBar } from "@/components/organisms/mobile/top-bar";

import "./laverte.css";
import "./mobile.css";

type Props = {
  children: ReactNode;
};

const DefaultLayout: FC<Props> = ({ children }) => {
  return (
    <>
      {/* Khải's design pins the exact families "Manrope"/"Lora" in laverte.css,
          so load them by those names rather than through next/font's hashed vars. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* App Router loads route fonts from the layout, not pages/_document; the
          legacy no-page-custom-font rule is a false positive here. */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <GlobalConfigs />
      {/* .lvd = desktop only, the Mobile* parts are phone only (mobile.css). */}
      <div className="lvd">
        <SiteHeader />
      </div>
      <MobileTopBar />
      <main id="top">{children}</main>
      <div className="lvd">
        <SiteFooter />
        <ChatButton />
      </div>
      <MobileFooter />
    </>
  );
};

export default DefaultLayout;
