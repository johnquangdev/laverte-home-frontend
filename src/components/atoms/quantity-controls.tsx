"use client";

import { Minus, Plus } from "lucide-react";
import type { FC } from "react";

type Props = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
};

export const QuantityControls: FC<Props> = ({
  value,
  onDecrease,
  onIncrease,
  min = 1,
  max,
}) => {
  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  return (
    <div className="border-beige flex items-center gap-2 rounded-sm border bg-white px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
      <button
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        className="text-primary/70 hover:text-primary flex h-5 w-5 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:h-6 sm:w-6"
        aria-label="Giảm số lượng"
      >
        <Minus className="size-3.5 sm:size-4" />
      </button>
      <span className="font-montserrat text-primary min-w-[2ch] text-center text-xs font-medium sm:text-sm">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        className="text-primary/70 hover:text-primary flex h-5 w-5 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:h-6 sm:w-6"
        aria-label="Tăng số lượng"
      >
        <Plus className="size-3.5 sm:size-4" />
      </button>
    </div>
  );
};
