import { TrendingDown, TrendingUp } from "lucide-react";
import type { FC } from "react";

import type { Point } from "@/utils/chart";
import { smoothPath } from "@/utils/chart";

type Props = {
  label: string;
  value: string;
  /** Percent change against the previous period. Omit when there is nothing to compare. */
  delta?: number;
  hint?: string;
  /** Trailing values behind the headline, drawn as a sparkline. */
  spark?: number[];
  /** Renders the tile at hero size for the one number that leads the page. */
  hero?: boolean;
};

const Sparkline: FC<{ values: number[]; up: boolean }> = ({ values, up }) => {
  const W = 96;
  const H = 28;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts: Point[] = values.map((v, i) => [
    (i * W) / Math.max(values.length - 1, 1),
    H - 2 - ((v - min) / span) * (H - 4),
  ]);
  const stroke = up ? "var(--color-delta-up)" : "var(--color-delta-down)";

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="shrink-0 overflow-visible"
      role="presentation"
    >
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <circle cx={pts.at(-1)?.[0]} cy={pts.at(-1)?.[1]} r={2.5} fill={stroke} />
    </svg>
  );
};

export const StatTile: FC<Props> = ({
  label,
  value,
  delta,
  hint,
  spark,
  hero,
}) => {
  const up = delta === undefined || delta >= 0;
  const Arrow = up ? TrendingUp : TrendingDown;

  return (
    <article className="border-admin-line rounded-card bg-admin-card border p-4 shadow-[0_1px_2px_rgba(23,23,23,0.04)] transition-shadow hover:shadow-[0_2px_10px_rgba(23,23,23,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-admin-body text-sm">{label}</p>
        {spark && spark.length > 1 ? (
          <Sparkline values={spark} up={up} />
        ) : null}
      </div>

      {/* Proportional figures on purpose: tabular digits make a standalone
          display number look loosely spaced. */}
      <p
        className={`text-admin-ink mt-1.5 font-semibold tracking-tight ${
          hero ? "text-[34px] leading-none" : "text-2xl"
        }`}
      >
        {value}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        {delta !== undefined ? (
          <span
            className={`rounded-pill inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium ${
              up
                ? "text-delta-up bg-state-paid"
                : "text-delta-down bg-state-cancelled"
            }`}
          >
            <Arrow aria-hidden="true" className="size-3.5" />
            {up && delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        ) : null}
        {hint ? <span className="text-admin-body text-xs">{hint}</span> : null}
      </div>
    </article>
  );
};
