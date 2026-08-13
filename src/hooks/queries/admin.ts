import { useQueryKeys } from "@/hooks/query-keys";
import { internalAxiosClient } from "@/lib/axios";
import type {
  AdminBookingEntity,
  HomeEntity,
  OverviewEntity,
} from "@/types/api/entities";
import { useQuery } from "@tanstack/react-query";

export const useAdminHomesQuery = () => {
  const { Keys } = useQueryKeys();
  return useQuery<HomeEntity[]>({
    queryKey: Keys.ADMIN_HOMES,
    queryFn: async () => {
      const response =
        await internalAxiosClient.get<HomeEntity[]>("/admin/homes");
      return response.data;
    },
  });
};

export const useAdminBookingsQuery = (date: string, homeId?: number) => {
  const { Keys } = useQueryKeys();
  return useQuery<AdminBookingEntity[]>({
    queryKey: Keys.ADMIN_BOOKINGS(date, homeId),
    queryFn: async () => {
      const params = new URLSearchParams({ date });
      if (homeId) params.set("home_id", String(homeId));
      const response = await internalAxiosClient.get<AdminBookingEntity[]>(
        `/admin/bookings?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useAdminOverviewQuery = (from: string, to: string) => {
  const { Keys } = useQueryKeys();
  return useQuery<OverviewEntity>({
    queryKey: Keys.ADMIN_OVERVIEW(from, to),
    queryFn: async () => {
      const params = new URLSearchParams({ from, to });
      const response = await internalAxiosClient.get<OverviewEntity>(
        `/admin/overview?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useGoogleLoginUrlQuery = (enabled = false) => {
  const { Keys } = useQueryKeys();
  return useQuery<{ url: string }>({
    queryKey: Keys.GOOGLE_LOGIN_URL,
    enabled,
    queryFn: async () => {
      const response = await internalAxiosClient.get<{ url: string }>(
        "/auth/google/login-url"
      );
      return response.data;
    },
  });
};
