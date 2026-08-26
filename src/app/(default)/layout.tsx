import type { FC, ReactNode } from "react";

import { Cart } from "@/components/organisms/common/cart";
import { Footer } from "@/components/organisms/common/footer";
import { GlobalConfigs } from "@/components/organisms/common/global-configs";
import { NewHeader } from "@/components/organisms/common/new-header";

type Props = {
  children: ReactNode;
};

const DefaultLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <GlobalConfigs />
      <NewHeader />
      {children}
      <Footer />
      <Cart />
    </>
  );
};

export default DefaultLayout;
