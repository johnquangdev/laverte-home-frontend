import type { FC } from "react";

import { BookingSection } from "@/components/organisms/booking/booking-section";
import { MobileBooking } from "@/components/organisms/mobile/booking";

type Props = {
  searchParams: Promise<{ home?: string; stay?: string }>;
};

const BookPage: FC<Props> = async ({ searchParams }) => {
  const params = await searchParams;
  const homeId = Number(params.home ?? "");
  const defaultHomeId =
    Number.isFinite(homeId) && homeId > 0 ? homeId : undefined;

  return (
    <>
      <div className="lvd">
        <BookingSection defaultHomeId={defaultHomeId} />
      </div>
      <MobileBooking defaultHomeId={defaultHomeId} stayKey={params.stay} />
    </>
  );
};

export default BookPage;
