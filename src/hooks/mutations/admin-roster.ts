import { internalAxiosClient } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ADMINS_KEY = ["admin", "admins"];

export const useGrantAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (email) => {
      await internalAxiosClient.post("/admin/admins", { email });
    },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ADMINS_KEY }),
  });
};

export const useRevokeAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (userId) => {
      await internalAxiosClient.delete(`/admin/admins/${userId}`);
    },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ADMINS_KEY }),
  });
};
