export type BookingType = "hourly" | "overnight" | "day";

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "expired"
  | "completed"
  | "no_show";

export type BookingEntity = {
  id: number;
  home_id: number;
  customer_name: string;
  customer_phone: string;
  start_time: string;
  end_time: string;
  booking_type: BookingType;
  computed_price: number;
  status: BookingStatus;
  expires_at: string | null;
  qr_content?: string;
};

export type AdminBookingEntity = BookingEntity & {
  created_at: string;
  door_lock_code: string | null;
  lock_code_sent_at: string | null;
  google_calendar_event_id: string;
  created_by_admin_id: number | null;
};

export type HomeEntity = {
  id: number;
  name: string;
  category: "home" | "nest";
  address: string;
  description: string;
  google_calendar_id: string;
  is_active: boolean;
};

export type UserEntity = {
  id: number;
  email: string;
  role: string;
};

export type SessionEntity = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: UserEntity;
};

export type OverviewEntity = {
  from: string;
  to: string;
  total_revenue_vnd: number;
  booking_count: number;
};
