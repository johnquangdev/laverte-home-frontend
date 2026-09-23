import { useQueryKeys } from "@/hooks/query-keys";
import { internalAxiosClient } from "@/lib/axios";
import type { PostCreateWalkInBookingRequest } from "@/types/api/dtos";
import type { AdminBookingEntity } from "@/types/api/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const invalidateBookings = (
  queryClient: ReturnType<typeof useQueryClient>,
  keys: ReturnType<typeof useQueryKeys>["Keys"]
) => {
  void queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
  void queryClient.invalidateQueries({ queryKey: keys.ADMIN_OVERVIEW() });
  void queryClient.invalidateQueries({ queryKey: keys.ADMIN_BREAKDOWN() });
  // A cash walk-in writes a payment, and a cancel can make a paid row refundable.
  void queryClient.invalidateQueries({ queryKey: keys.ADMIN_PAYMENTS() });
};

export const useCancelBookingMutation = () => {
  const queryClient = useQueryClient();
  const { Keys } = useQueryKeys();
  return useMutation<void, Error, number>({
    mutationFn: async (bookingId) => {
      await internalAxiosClient.patch(`/admin/bookings/${bookingId}/cancel`);
    },
    onSuccess: () => invalidateBookings(queryClient, Keys),
  });
};

export const useCompleteBookingMutation = () => {
  const queryClient = useQueryClient();
  const { Keys } = useQueryKeys();
  return useMutation<void, Error, number>({
    mutationFn: async (bookingId) => {
      await internalAxiosClient.patch(`/admin/bookings/${bookingId}/complete`);
    },
    onSuccess: () => invalidateBookings(queryClient, Keys),
  });
};

export const useNoShowBookingMutation = () => {
  const queryClient = useQueryClient();
  const { Keys } = useQueryKeys();
  return useMutation<void, Error, number>({
    mutationFn: async (bookingId) => {
      await internalAxiosClient.patch(`/admin/bookings/${bookingId}/no-show`);
    },
    onSuccess: () => invalidateBookings(queryClient, Keys),
  });
};

export const useSetLockCodeMutation = () => {
  const queryClient = useQueryClient();
  const { Keys } = useQueryKeys();
  return useMutation<void, Error, { bookingId: number; code: string }>({
    mutationFn: async ({ bookingId, code }) => {
      await internalAxiosClient.patch(
        `/admin/bookings/${bookingId}/lock-code`,
        {
          code,
        }
      );
    },
    onSuccess: () => invalidateBookings(queryClient, Keys),
  });
};

export const useSendLockCodeMutation = () => {
  const queryClient = useQueryClient();
  const { Keys } = useQueryKeys();
  return useMutation<void, Error, number>({
    mutationFn: async (bookingId) => {
      await internalAxiosClient.post(
        `/admin/bookings/${bookingId}/send-lock-code`
      );
    },
    onSuccess: () => invalidateBookings(queryClient, Keys),
  });
};

export const useCreateWalkInBookingMutation = () => {
  const queryClient = useQueryClient();
  const { Keys } = useQueryKeys();
  return useMutation<AdminBookingEntity, Error, PostCreateWalkInBookingRequest>(
    {
      mutationFn: async (payload) => {
        const response = await internalAxiosClient.post<AdminBookingEntity>(
          "/admin/bookings",
          payload
        );
        return response.data;
      },
      onSuccess: () => invalidateBookings(queryClient, Keys),
    }
  );
};
