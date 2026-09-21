"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

export type MenuItem = {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  disabled?: boolean;
  /** Renders the item in the danger tone and puts a separator above it. */
  destructive?: boolean;
};

type Props = {
  /** Accessible name for the trigger — it is icon-only. */
  label: string;
  trigger: ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
};

/**
 * Hand-rolled rather than pulling in a menu library for one screen: the whole
 * contract is Escape, outside-click, roving arrow keys and returning focus to
 * the trigger. Swap for @radix-ui/react-dropdown-menu if submenus or typeahead
 * ever come up.
 */
export const DropdownMenu: FC<Props> = ({
  label,
  trigger,
  items,
  align = "end",
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) itemRefs.current[active]?.focus();
  }, [open, active]);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const enabledIndexes = items
    .map((item, i) => (item.disabled ? -1 : i))
    .filter((i) => i >= 0);

  const move = (delta: number) => {
    if (enabledIndexes.length === 0) return;
    const pos = enabledIndexes.indexOf(active);
    const next =
      enabledIndexes[
        (pos + delta + enabledIndexes.length) % enabledIndexes.length
      ];
    setActive(next ?? enabledIndexes[0]);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => {
          setActive(enabledIndexes[0] ?? 0);
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActive(enabledIndexes[0] ?? 0);
            setOpen(true);
          }
        }}
        className="text-admin-body hover:bg-admin-page hover:text-admin-ink focus-visible:ring-admin-accent flex size-8 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {trigger}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              move(1);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              move(-1);
            } else if (e.key === "Tab") {
              close(false);
            }
          }}
          className={`border-admin-line bg-admin-card rounded-card absolute top-full z-20 mt-1 min-w-48 border p-1 shadow-[0_8px_24px_rgba(23,23,23,0.10)] ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                {item.destructive ? (
                  <span
                    aria-hidden="true"
                    className="bg-admin-line my-1 block h-px"
                  />
                ) : null}
                <button
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={i === active ? 0 : -1}
                  disabled={item.disabled}
                  onClick={() => {
                    close();
                    item.onSelect();
                  }}
                  onMouseEnter={() => !item.disabled && setActive(i)}
                  className={`rounded-field flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-sm transition-colors disabled:opacity-40 ${
                    item.destructive
                      ? "text-danger-fg hover:bg-state-cancelled"
                      : "text-admin-ink hover:bg-admin-page"
                  } ${i === active && !item.disabled ? (item.destructive ? "bg-state-cancelled" : "bg-admin-page") : ""}`}
                >
                  {Icon ? (
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                  ) : null}
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
