import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const OPENING_QUOTE = "\u201C";
const CLOSING_QUOTE = "\u201D";

export const Quote: FC<Props> = ({ children }) => {
  return (
    <>
      {OPENING_QUOTE}
      {children}
      {CLOSING_QUOTE}
    </>
  );
};
