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

export type PublicHomeEntity = {
  id: number;
  name: string;
  category: "home" | "nest";
  address: string;
  description: string;
};

export type HomeCategory = HomeEntity["category"];

/** Money fields are whole VND. Which fields are set depends on rule_type. */
export type PricingRuleEntity = {
  id: number;
  category: HomeCategory;
  rule_type: BookingType;
  base_hours: number | null;
  base_price: number | null;
  extra_hour_price: number | null;
  window_start: string | null;
  window_end: string | null;
  flat_price: number | null;
  is_active: boolean;
};

export type BlockedSlotEntity = {
  id: number;
  home_id: number;
  start_time: string;
  end_time: string;
  reason: string;
  created_by_admin_id: number | null;
};

export type PaymentStatus =
  | "pending"
  | "paid"
  | "expired"
  | "failed"
  | "refunded";

export type AdminPaymentEntity = {
  id: number;
  booking_id: number;
  customer_name: string;
  customer_phone: string;
  home_id: number;
  booking_status: BookingStatus;
  provider: "sepay" | "cash";
  amount: number;
  status: PaymentStatus;
  qr_content: string;
  sepay_transaction_ref: string;
  paid_at: string | null;
  refunded_at: string | null;
  refund_note: string;
  created_at: string;
};

export type UnmatchedReason =
  | "no_memo"
  | "booking_not_found"
  | "booking_not_pending"
  | "amount_mismatch";

export type UnmatchedTransferEntity = {
  id: number;
  sepay_transaction_ref: string;
  amount: number;
  content: string;
  reason: UnmatchedReason;
  booking_ref: number | null;
  received_at: string;
  resolved_at: string | null;
  resolved_by_admin_id: number | null;
  resolution_note: string;
};

export type AdminSettingsEntity = {
  app_timezone: string;
  booking_pending_ttl_minutes: number;
  checkin_alert_lead_minutes: number;
  admin_alert_email: string;
  sepay: {
    bank_account: string;
    bank_code: string;
    transfer_prefix: string;
    webhook_secret_set: boolean;
    webhook_path: string;
  };
  integrations: {
    google_login: boolean;
    google_calendar: boolean;
    zalo_zns: boolean;
    admin_email: boolean;
  };
};

export type OverviewMonthEntity = {
  month: string;
  revenue_vnd: number;
  booking_count: number;
  hourly_count: number;
  overnight_count: number;
  day_count: number;
};

export type OverviewHomeEntity = {
  home_id: number;
  name: string;
  category: HomeCategory;
  is_active: boolean;
  booking_count: number;
  occupied_hours: number;
  occupancy_percent: number;
  revenue_vnd: number;
};

export type OverviewBreakdownEntity = {
  month: string;
  /** Oldest first, always 24 entries ending at `month`. */
  months: OverviewMonthEntity[];
  occupancy_percent: number;
  booked_days: number[];
  homes: OverviewHomeEntity[];
};

export type AdminListItemEntity = {
  id: number;
  email: string;
  role: string;
};

export type AvailabilityEntity = {
  home_id: number;
  from: string;
  to: string;
  busy: { start_time: string; end_time: string }[];
};
