import type { FC } from "react";

type Props = {
  number: number;
  title: string;
};

export const SectionHead: FC<Props> = ({ number, title }) => {
  return (
    <h2 className="text-secondary font-playfair mt-8 mb-4 text-2xl font-medium">
      <span className="mr-2">{number}.</span>
      {title}
    </h2>
  );
};
