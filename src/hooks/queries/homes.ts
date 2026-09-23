import { useQueryKeys } from "@/hooks/query-keys";
import { internalAxiosClient } from "@/lib/axios";
import type {
  AvailabilityEntity,
  PublicHomeEntity,
} from "@/types/api/entities";
import { useQuery } from "@tanstack/react-query";

export const useHomesQuery = () => {
  const { Keys } = useQueryKeys();
  return useQuery<PublicHomeEntity[]>({
    queryKey: Keys.HOMES,
    queryFn: async () => {
      const response =
        await internalAxiosClient.get<PublicHomeEntity[]>("/homes");
      return response.data;
    },
    staleTime: 60_000,
  });
};

/** Busy windows for one home over [from, to), both RFC3339. */
export const useAvailabilityQuery = (
  homeId: number | undefined,
  from: string,
  to: string
) => {
  const { Keys } = useQueryKeys();
  return useQuery<AvailabilityEntity>({
    queryKey: Keys.AVAILABILITY(homeId, from, to),
    enabled: homeId !== undefined,
    queryFn: async () => {
      const params = new URLSearchParams({ from, to });
      const response = await internalAxiosClient.get<AvailabilityEntity>(
        `/homes/${homeId}/availability?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 30_000,
  });
};
