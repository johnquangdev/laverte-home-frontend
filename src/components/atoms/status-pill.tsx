import type { FC, ReactNode } from "react";

import type { BookingStatus } from "@/types/api/entities";
import { cn } from "@/utils/common";

export type StatusTone =
  | "paid"
  | "pending"
  | "checkin"
  | "expired"
  | "cancelled";

// Outlined, not filled: pale surface, mid-tone border, saturated label. Filled
// pills at this size fight the table rows for attention.
const toneStyles: Record<StatusTone, string> = {
  paid: "bg-state-paid border-state-paid-line text-state-paid-fg",
  pending: "bg-state-pending border-state-pending-line text-state-pending-fg",
  checkin: "bg-state-checkin border-state-checkin-line text-state-checkin-fg",
  expired: "bg-state-expired border-state-expired-line text-state-expired-fg",
  cancelled:
    "bg-state-cancelled border-state-cancelled-line text-state-cancelled-fg",
};

/**
 * The reference carries three states; a La Verte booking has six, so cancelled
 * and no_show share the failure hue and are told apart by label.
 */
export const BOOKING_STATUS: Record<
  BookingStatus,
  { tone: StatusTone; label: string }
> = {
  pending_payment: { tone: "pending", label: "Chờ thanh toán" },
  confirmed: { tone: "paid", label: "Đã xác nhận" },
  completed: { tone: "checkin", label: "Hoàn thành" },
  cancelled: { tone: "cancelled", label: "Đã huỷ" },
  no_show: { tone: "cancelled", label: "Không đến" },
  expired: { tone: "expired", label: "Hết hạn" },
};

type Props = {
  tone: StatusTone;
  children: ReactNode;
  className?: string;
};

export const StatusPill: FC<Props> = ({ tone, children, className }) => (
  <span
    className={cn(
      "rounded-pill inline-flex items-center border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
      toneStyles[tone],
      className
    )}
  >
    {children}
  </span>
);
