import { useQueryKeys } from "@/hooks/query-keys";
import { internalAxiosClient } from "@/lib/axios";
import type {
  AdminBookingEntity,
  AdminListItemEntity,
  AdminPaymentEntity,
  AdminSettingsEntity,
  BlockedSlotEntity,
  HomeCategory,
  HomeEntity,
  OverviewBreakdownEntity,
  PricingRuleEntity,
  UnmatchedTransferEntity,
} from "@/types/api/entities";
import { useQuery } from "@tanstack/react-query";

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

/**
 * Active rules for one category. The backend filters on an exact category, so
 * an empty one answers an empty list rather than every rule.
 */
export const usePricingRulesQuery = (category: HomeCategory) => {
  const { Keys } = useQueryKeys();
  return useQuery<PricingRuleEntity[]>({
    queryKey: Keys.ADMIN_PRICING_RULES(category),
    queryFn: async () => {
      const response = await internalAxiosClient.get<PricingRuleEntity[]>(
        `/admin/pricing-rules?category=${category}`
      );
      return response.data;
    },
  });
};

export const useBlockedSlotsQuery = (homeId: number | undefined) => {
  const { Keys } = useQueryKeys();
  return useQuery<BlockedSlotEntity[]>({
    queryKey: Keys.ADMIN_BLOCKED_SLOTS(homeId),
    enabled: homeId !== undefined,
    queryFn: async () => {
      const response = await internalAxiosClient.get<BlockedSlotEntity[]>(
        `/admin/blocked-slots?home_id=${homeId}`
      );
      return response.data;
    },
  });
};

/** `to` is exclusive, like the overview's: pass the day after the last one shown. */
export const useAdminPaymentsQuery = (from: string, to: string) => {
  const { Keys } = useQueryKeys();
  return useQuery<AdminPaymentEntity[]>({
    queryKey: Keys.ADMIN_PAYMENTS(from, to),
    queryFn: async () => {
      const params = new URLSearchParams({ from, to });
      const response = await internalAxiosClient.get<AdminPaymentEntity[]>(
        `/admin/payments?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useUnmatchedTransfersQuery = (
  status: "open" | "all",
  enabled = true
) => {
  const { Keys } = useQueryKeys();
  return useQuery<UnmatchedTransferEntity[]>({
    queryKey: Keys.ADMIN_UNMATCHED(status),
    enabled,
    queryFn: async () => {
      const response = await internalAxiosClient.get<UnmatchedTransferEntity[]>(
        `/admin/unmatched-transfers?status=${status}`
      );
      return response.data;
    },
  });
};

export const useAdminSettingsQuery = () => {
  const { Keys } = useQueryKeys();
  return useQuery<AdminSettingsEntity>({
    queryKey: Keys.ADMIN_SETTINGS,
    queryFn: async () => {
      const response =
        await internalAxiosClient.get<AdminSettingsEntity>("/admin/settings");
      return response.data;
    },
    // Fixed at boot on the backend; nothing on this screen can change it.
    staleTime: Infinity,
  });
};

export const useOverviewBreakdownQuery = (month: string) => {
  const { Keys } = useQueryKeys();
  return useQuery<OverviewBreakdownEntity>({
    queryKey: Keys.ADMIN_BREAKDOWN(month),
    queryFn: async () => {
      const response = await internalAxiosClient.get<OverviewBreakdownEntity>(
        `/admin/overview/breakdown?month=${month}`
      );
      return response.data;
    },
  });
};

/** Superadmin-only on the backend; anyone else gets a 403 here. */
export const useAdminsQuery = () => {
  const { Keys } = useQueryKeys();
  return useQuery<AdminListItemEntity[]>({
    queryKey: Keys.ADMIN_ADMINS,
    queryFn: async () => {
      const response =
        await internalAxiosClient.get<AdminListItemEntity[]>("/admin/admins");
      return response.data;
    },
    retry: false,
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
