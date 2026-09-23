import { internalAxiosClient } from "@/lib/axios";
import type { UpsertPricingRuleRequest } from "@/types/api/dtos";
import type { PricingRuleEntity } from "@/types/api/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PRICING_RULES_KEY = ["admin", "pricing-rules"];

export const useCreatePricingRuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<PricingRuleEntity, Error, UpsertPricingRuleRequest>({
    mutationFn: async (payload) => {
      const response = await internalAxiosClient.post<PricingRuleEntity>(
        "/admin/pricing-rules",
        payload
      );
      return response.data;
    },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: PRICING_RULES_KEY }),
  });
};

/**
 * Changing a price never edits the rule in place: the backend closes the old
 * rule now and opens a new one, so bookings already priced keep their price.
 * The response is the replacement, with a new id.
 */
export const useSupersedePricingRuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    PricingRuleEntity,
    Error,
    { id: number; payload: UpsertPricingRuleRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await internalAxiosClient.put<PricingRuleEntity>(
        `/admin/pricing-rules/${id}`,
        payload
      );
      return response.data;
    },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: PRICING_RULES_KEY }),
  });
};
