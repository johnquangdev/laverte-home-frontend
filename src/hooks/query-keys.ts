export const useQueryKeys = () => {
  const Keys = {
    ADMIN_HOMES: ["admin", "homes"] as const,
    ADMIN_BOOKINGS: (date?: string, homeId?: number) =>
      ["admin", "bookings", date, homeId] as const,
    ADMIN_OVERVIEW: (from: string, to: string) =>
      ["admin", "overview", from, to] as const,
    GOOGLE_LOGIN_URL: ["auth", "google-login-url"] as const,
  };

  return { Keys };
};
