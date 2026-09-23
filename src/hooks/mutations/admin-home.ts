import { useQueryKeys } from "@/hooks/query-keys";
import { internalAxiosClient } from "@/lib/axios";
import type {
  PostCreateHomeRequest,
  PutUpdateHomeRequest,
} from "@/types/api/dtos";
import type { HomeEntity } from "@/types/api/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// The guest list is filtered on is_active, so it goes stale with the admin one.
const useInvalidateHomes = () => {
  const queryClient = useQueryClient();
  const { Keys } = useQueryKeys();
  return () => {
    void queryClient.invalidateQueries({ queryKey: Keys.ADMIN_HOMES });
    void queryClient.invalidateQueries({ queryKey: Keys.HOMES });
  };
};

export const useCreateHomeMutation = () => {
  const invalidate = useInvalidateHomes();
  return useMutation<HomeEntity, Error, PostCreateHomeRequest>({
    mutationFn: async (payload) => {
      const response = await internalAxiosClient.post<HomeEntity>(
        "/admin/homes",
        payload
      );
      return response.data;
    },
    onSuccess: invalidate,
  });
};

export const useUpdateHomeMutation = () => {
  const invalidate = useInvalidateHomes();
  return useMutation<
    HomeEntity,
    Error,
    { id: number; payload: PutUpdateHomeRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await internalAxiosClient.put<HomeEntity>(
        `/admin/homes/${id}`,
        payload
      );
      return response.data;
    },
    onSuccess: invalidate,
  });
};
