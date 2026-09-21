import { useQueryKeys } from "@/hooks/query-keys";
import { internalAxiosClient } from "@/lib/axios";
import type {
  AdminBookingEntity,
  HomeEntity,
  OverviewEntity,
} from "@/types/api/entities";
import { useQueries, useQuery } from "@tanstack/react-query";

const fetchAdminBookings = async (
  date: string,
  homeId: number
): Promise<AdminBookingEntity[]> => {
  const params = new URLSearchParams({ date, home_id: String(homeId) });
  const response = await internalAxiosClient.get<AdminBookingEntity[]>(
    `/admin/bookings?${params.toString()}`
  );
  return response.data;
};

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

export const useAdminBookingsQuery = (
  date: string,
  homeId: number | undefined,
  homes: HomeEntity[] | undefined
) => {
  const { Keys } = useQueryKeys();
  return useQuery<AdminBookingEntity[]>({
    queryKey: Keys.ADMIN_BOOKINGS(date, homeId),
    enabled: Boolean(homes?.length),
    queryFn: async () => {
      const activeHomes = homes ?? [];
      if (homeId) {
        return fetchAdminBookings(date, homeId);
      }
      const batches = await Promise.all(
        activeHomes.map((home) => fetchAdminBookings(date, home.id))
      );
      return batches
        .flat()
        .sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
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

/**
 * One aggregate request per month. The overview endpoint only returns totals for
 * a range, so a trend has to be assembled client-side — six cheap aggregates
 * rather than a day-by-day sweep, which would be thirty.
 */
export const useMonthlyOverviewQueries = (
  ranges: { from: string; to: string }[]
) => {
  const { Keys } = useQueryKeys();
  return useQueries({
    queries: ranges.map(({ from, to }) => ({
      queryKey: Keys.ADMIN_OVERVIEW(from, to),
      queryFn: async (): Promise<OverviewEntity> => {
        const params = new URLSearchParams({ from, to });
        const response = await internalAxiosClient.get<OverviewEntity>(
          `/admin/overview?${params.toString()}`
        );
        return response.data;
      },
    })),
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
