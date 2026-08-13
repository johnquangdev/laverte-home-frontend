import type { FC } from "react";

import { BookingSection } from "@/components/organisms/booking/booking-section";

type Props = {
  searchParams: Promise<{ home?: string }>;
};

const BookPage: FC<Props> = async ({ searchParams }) => {
  const params = await searchParams;
  const homeId = Number(params.home ?? "1");

  return (
    <BookingSection
      defaultHomeId={Number.isFinite(homeId) && homeId > 0 ? homeId : 1}
    />
  );
};

export default BookPage;
