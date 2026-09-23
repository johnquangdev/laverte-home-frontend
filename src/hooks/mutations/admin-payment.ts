import { internalAxiosClient } from "@/lib/axios";
import type {
  AdminPaymentEntity,
  UnmatchedTransferEntity,
} from "@/types/api/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRefundPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AdminPaymentEntity,
    Error,
    { paymentId: number; note: string }
  >({
    mutationFn: async ({ paymentId, note }) => {
      const response = await internalAxiosClient.post<AdminPaymentEntity>(
        `/admin/payments/${paymentId}/refund`,
        { note }
      );
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
      // Revenue only counts paid rows, so a refund moves the overview too.
      void queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "overview-breakdown"],
      });
    },
  });
};

export const useResolveUnmatchedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UnmatchedTransferEntity,
    Error,
    { transferId: number; note: string }
  >({
    mutationFn: async ({ transferId, note }) => {
      const response = await internalAxiosClient.patch<UnmatchedTransferEntity>(
        `/admin/unmatched-transfers/${transferId}/resolve`,
        { note }
      );
      return response.data;
    },
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: ["admin", "unmatched-transfers"],
      }),
  });
};
