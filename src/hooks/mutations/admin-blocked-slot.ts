import { internalAxiosClient } from "@/lib/axios";
import type { PostCreateBlockedSlotRequest } from "@/types/api/dtos";
import type { BlockedSlotEntity } from "@/types/api/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BLOCKED_SLOTS_KEY = ["admin", "blocked-slots"];

export const useCreateBlockedSlotMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<BlockedSlotEntity, Error, PostCreateBlockedSlotRequest>({
    mutationFn: async (payload) => {
      const response = await internalAxiosClient.post<BlockedSlotEntity>(
        "/admin/blocked-slots",
        payload
      );
      return response.data;
    },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: BLOCKED_SLOTS_KEY }),
  });
};

export const useDeleteBlockedSlotMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (slotId) => {
      await internalAxiosClient.delete(`/admin/blocked-slots/${slotId}`);
    },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: BLOCKED_SLOTS_KEY }),
  });
};
