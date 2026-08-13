import { useQueryKeys } from "@/hooks/query-keys";
import { internalAxiosClient } from "@/lib/axios";
import type { PostCreateBookingRequest } from "@/types/api/dtos";
import type { BookingEntity, SessionEntity } from "@/types/api/entities";
import { useMutation } from "@tanstack/react-query";

export const useCreateBookingMutation = () => {
  const { Keys } = useQueryKeys();
  return useMutation<BookingEntity, Error, PostCreateBookingRequest>({
    mutationKey: Keys.ADMIN_BOOKINGS(),
    mutationFn: async (payload) => {
      const response = await internalAxiosClient.post<BookingEntity>(
        "/bookings",
        payload
      );
      return response.data;
    },
  });
};

export const useGoogleCallbackMutation = () => {
  return useMutation<SessionEntity, Error, { code: string; state: string }>({
    mutationFn: async (payload) => {
      const response = await internalAxiosClient.post<SessionEntity>(
        "/auth/google/callback",
        payload
      );
      return response.data;
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await internalAxiosClient.post("/auth/logout");
    },
  });
};
