import type { BookingType, HomeCategory } from "@/types/api/entities";

export const HOME_CATEGORY_LABELS: Record<HomeCategory, string> = {
  home: "Home",
  nest: "Nest",
};

export const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  hourly: "Theo giờ",
  overnight: "Qua đêm",
  day: "Theo ngày",
};
