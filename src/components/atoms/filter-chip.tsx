"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import type { FC } from "react";

export type FilterOption = { value: string; label: string; count?: number };

type Props = {
  label: string;
  options: FilterOption[];
  /** Empty means "no filter" — the chip then reads as the dashed add affordance. */
  selected: string[];
  onChange: (selected: string[]) => void;
};

/**
 * Dashed until it holds a value, solid once it does — the reference's way of
 * saying "this is an available filter" versus "this filter is on".
 */
export const FilterChip: FC<Props> = ({
  label,
  options,
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = selected.length > 0;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const toggle = (value: string) =>
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );

  const summary = active
    ? options
        .filter((o) => selected.includes(o.value))
        .map((o) => o.label)
        .join(", ")
    : null;

  return (
    <div ref={rootRef} className="relative">
      <div
        className={`rounded-pill min-h-control-sm flex items-center transition-colors ${
          active
            ? "border-admin-ink bg-admin-ink border text-white"
            : "border-admin-field text-admin-body hover:text-admin-ink border border-dashed"
        }`}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className={`focus-visible:ring-admin-accent min-h-control-sm rounded-pill flex items-center gap-1.5 px-3 text-sm focus-visible:ring-2 focus-visible:outline-none ${
            active ? "pr-2" : ""
          }`}
        >
          {!active ? (
            <Plus aria-hidden="true" className="size-3.5 shrink-0" />
          ) : null}
          <span className="max-w-44 truncate">
            {label}
            {summary ? (
              <span className="text-white/70">: {summary}</span>
            ) : null}
          </span>
        </button>

        {active ? (
          <button
            type="button"
            aria-label={`Bỏ lọc ${label}`}
            onClick={() => onChange([])}
            className="focus-visible:ring-admin-accent mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:outline-none"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        ) : null}
      </div>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          aria-multiselectable="true"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className="border-admin-line bg-admin-card rounded-card absolute top-full left-0 z-20 mt-1 min-w-52 border p-1 shadow-[0_8px_24px_rgba(23,23,23,0.10)]"
        >
          {options.map((option) => {
            const checked = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => toggle(option.value)}
                className="rounded-field hover:bg-admin-page flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-sm transition-colors"
              >
                <span
                  aria-hidden="true"
                  className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border ${
                    checked
                      ? "border-admin-ink bg-admin-ink text-white"
                      : "border-admin-field"
                  }`}
                >
                  {checked ? <Check className="size-3" /> : null}
                </span>
                <span className="text-admin-ink min-w-0 flex-1 truncate">
                  {option.label}
                </span>
                {option.count !== undefined ? (
                  <span className="text-admin-body text-xs tabular-nums">
                    {option.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
