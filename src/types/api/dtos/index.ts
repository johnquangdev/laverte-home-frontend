import type { BookingType, HomeCategory } from "@/types/api/entities";

export type PostCreateBookingRequest = {
  home_id: number;
  customer_name: string;
  customer_phone: string;
  start_time: string;
  end_time: string;
  booking_type: BookingType;
};

export type PostGoogleCallbackRequest = {
  code: string;
  state: string;
};

export type PostRefreshRequest = {
  refresh_token: string;
};

export type GetAdminBookingsQuery = {
  home_id?: string;
  date?: string;
};

export type GetOverviewQuery = {
  from: string;
  to: string;
};

export type PostCreateHomeRequest = {
  name: string;
  category: HomeCategory;
  address: string;
  description: string;
};

/**
 * Name/category/address/description are replaced outright; an omitted
 * google_calendar_id or is_active is left as-is by the backend.
 */
export type PutUpdateHomeRequest = PostCreateHomeRequest & {
  google_calendar_id?: string;
  is_active?: boolean;
};

export type UpsertPricingRuleRequest = {
  category: HomeCategory;
  rule_type: BookingType;
  base_hours?: number;
  base_price?: number;
  extra_hour_price?: number;
  window_start?: string;
  window_end?: string;
  flat_price?: number;
};

export type PostCreateBlockedSlotRequest = {
  home_id: number;
  start_time: string;
  end_time: string;
  reason: string;
};

export type PostCreateWalkInBookingRequest = PostCreateBookingRequest & {
  paid_cash: boolean;
};
