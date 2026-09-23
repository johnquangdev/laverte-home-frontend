export const useQueryKeys = () => {
  const Keys = {
    HOMES: ["homes"] as const,
    ADMIN_HOMES: ["admin", "homes"] as const,
    ADMIN_BOOKINGS: (date?: string, homeId?: number) =>
      ["admin", "bookings", date, homeId] as const,
    ADMIN_OVERVIEW: (from?: string, to?: string) =>
      ["admin", "overview", from, to] as const,
    ADMIN_PRICING_RULES: (category?: string) =>
      ["admin", "pricing-rules", category] as const,
    ADMIN_BLOCKED_SLOTS: (homeId?: number) =>
      ["admin", "blocked-slots", homeId] as const,
    ADMIN_PAYMENTS: (from?: string, to?: string) =>
      ["admin", "payments", from, to] as const,
    ADMIN_UNMATCHED: (status?: string) =>
      ["admin", "unmatched-transfers", status] as const,
    ADMIN_SETTINGS: ["admin", "settings"] as const,
    ADMIN_BREAKDOWN: (month?: string) =>
      ["admin", "overview-breakdown", month] as const,
    ADMIN_ADMINS: ["admin", "admins"] as const,
    AVAILABILITY: (homeId?: number, from?: string, to?: string) =>
      ["availability", homeId, from, to] as const,
    GOOGLE_LOGIN_URL: ["auth", "google-login-url"] as const,
  };

  return { Keys };
};
