import type { BookingType } from "@/types/api/entities";

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
