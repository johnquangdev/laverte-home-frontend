import { useQueryKeys } from "@/hooks/query-keys";
import { internalAxiosClient } from "@/lib/axios";
import type { PublicHomeEntity } from "@/types/api/entities";
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
