import type { FC, ReactNode } from "react";

import { Footer } from "@/components/organisms/common/footer";
import { Header } from "@/components/organisms/common/header";

type Props = {
  children: ReactNode;
};

const DefaultLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
