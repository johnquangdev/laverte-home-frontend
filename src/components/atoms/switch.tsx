"use client";

import type { FC } from "react";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible text beside the control; also the accessible name. */
  label: string;
};

export const Switch: FC<Props> = ({ checked, onChange, label }) => (
  <label className="min-h-control-md flex cursor-pointer items-center gap-2.5">
    <span className="text-admin-body text-sm select-none">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`focus-visible:ring-admin-accent relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
        checked ? "bg-admin-accent" : "bg-admin-field"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </label>
);
