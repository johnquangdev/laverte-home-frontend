import type { FC, ReactNode } from "react";

import type { Point } from "@/utils/chart";
import { smoothPath } from "@/utils/chart";

/**
 * Categorical slots, assigned in fixed order and never cycled. Validated for
 * CVD separation and the lightness band against a light surface; the orange
 * slot warns on contrast, which is why every chart here also ships a legend,
 * selective direct labels and a table twin.
 */
export const SERIES = ["#4f46e5", "#f97316", "#0d9488"] as const;

const GRID = "#e5e5e5";

type CardProps = {
  title: string;
  /** Marks panels drawn from sample numbers rather than the API. */
  sample?: boolean;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export const ChartCard: FC<CardProps> = ({
  title,
  sample,
  actions,
  children,
  className,
}) => (
  <section
    className={`border-admin-line rounded-card bg-admin-card border p-4 shadow-[0_1px_2px_rgba(23,23,23,0.04)] ${className ?? ""}`}
  >
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-admin-ink text-sm font-medium">{title}</h3>
        {sample ? (
          <span className="border-admin-line text-admin-body rounded-pill border px-2 py-0.5 text-[10px] font-medium">
            dữ liệu mẫu
          </span>
        ) : null}
      </div>
      {actions}
    </div>
    {children}
  </section>
);

export const Legend: FC<{ items: { name: string; color: string }[] }> = ({
  items,
}) => (
  <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
    {items.map((s) => (
      <li
        key={s.name}
        className="text-admin-body flex items-center gap-1.5 text-xs"
      >
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-sm"
          style={{ background: s.color }}
        />
        {s.name}
      </li>
    ))}
  </ul>
);

const TableTwin: FC<{
  caption: string;
  rowHeader: string;
  columns: string[];
  rows: { label: string; values: string[] }[];
}> = ({ caption, rowHeader, columns, rows }) => (
  <table className="sr-only">
    <caption>{caption}</caption>
    <thead>
      <tr>
        <th scope="col">{rowHeader}</th>
        {columns.map((c) => (
          <th key={c} scope="col">
            {c}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((r) => (
        <tr key={r.label}>
          <th scope="row">{r.label}</th>
          {r.values.map((v, i) => (
            <td key={i}>{v}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

/* ------------------------------------------------------------------ */

type LineSeries = { name: string; values: number[] };

type LineProps = {
  labels: string[];
  series: LineSeries[];
  format: (n: number) => string;
};

/**
 * Two series of the SAME measure on one axis. Two different measures would need
 * two charts — a second y-scale invents a correlation that is not in the data.
 */
export const LineChartPair: FC<LineProps> = ({ labels, series, format }) => {
  const W = 640;
  const H = 200;
  const PAD_L = 8;
  const PAD_R = 8;
  const max = Math.max(...series.flatMap((s) => s.values), 1);

  const x = (i: number) =>
    PAD_L + (i * (W - PAD_L - PAD_R)) / Math.max(labels.length - 1, 1);
  const y = (v: number) => H - (v / max) * (H - 12) - 6;

  return (
    <div>
      <div className="mb-3">
        <Legend
          items={series.map((s, i) => ({ name: s.name, color: SERIES[i] }))}
        />
      </div>

      <div className="flex gap-3">
        <div
          aria-hidden="true"
          className="text-admin-body flex w-14 shrink-0 flex-col justify-between text-right text-[11px] tabular-nums"
          style={{ height: H }}
        >
          <span>{format(max)}</span>
          <span>{format(max / 2)}</span>
          <span>{format(0)}</span>
        </div>

        <div className="relative min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="block w-full"
            style={{ height: H }}
            role="presentation"
          >
            {[6, H / 2, H - 6].map((ty) => (
              <line
                key={ty}
                x1={0}
                x2={W}
                y1={ty}
                y2={ty}
                stroke={GRID}
                strokeWidth={1}
              />
            ))}
            <defs>
              {series.map((s, si) => (
                <linearGradient
                  key={s.name}
                  id={`fill-${si}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={SERIES[si]} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={SERIES[si]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {series.map((s, si) => {
              const pts: Point[] = s.values.map((v, i) => [x(i), y(v)]);
              const line = smoothPath(pts);
              const lastX = x(s.values.length - 1);
              return (
                <g key={s.name}>
                  {/* The area fades out rather than sitting as a flat wash, so
                      two overlapping series stay readable where they cross. */}
                  <path
                    d={`${line} L ${lastX},${H - 6} L ${PAD_L},${H - 6} Z`}
                    fill={`url(#fill-${si})`}
                  />
                  <path
                    d={line}
                    fill="none"
                    stroke={SERIES[si]}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Endpoint marker only — a dot on every point reads as noise.
                      The white ring keeps it legible where the two lines meet. */}
                  <circle
                    cx={lastX}
                    cy={y(s.values.at(-1) ?? 0)}
                    r={4}
                    fill={SERIES[si]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover columns sit above the plot: a full-height hit target per x
              index, so the crosshair never needs pixel-accurate aim. */}
          <div className="absolute inset-0 flex">
            {labels.map((label, i) => (
              <div
                key={label}
                className="group/col relative flex-1"
                style={{ minWidth: 24 }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-current opacity-20 group-hover/col:block"
                />
                <div className="bg-admin-ink pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-md px-2 py-1.5 text-[11px] whitespace-nowrap text-white group-hover/col:block">
                  <p className="font-medium">{label}</p>
                  {series.map((s, si) => (
                    <p
                      key={s.name}
                      className="mt-0.5 flex items-center gap-1.5"
                    >
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-sm"
                        style={{ background: SERIES[si] }}
                      />
                      {s.name}: {format(s.values[i] ?? 0)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="text-admin-body mt-2 flex gap-0 pl-[68px] text-[11px]"
      >
        {labels.map((l) => (
          <span key={l} className="flex-1 text-center tabular-nums">
            {l}
          </span>
        ))}
      </div>

      <TableTwin
        caption="Số liệu theo tháng"
        rowHeader="Tháng"
        columns={series.map((s) => s.name)}
        rows={labels.map((l, i) => ({
          label: l,
          values: series.map((s) => format(s.values[i] ?? 0)),
        }))}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */

type DonutProps = {
  /** 0–100. */
  percent: number;
  caption: string;
};

export const Donut: FC<DonutProps> = ({ percent, caption }) => {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const filled = (Math.min(Math.max(percent, 0), 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          width={140}
          height={140}
          role="img"
          aria-label={`${percent}% — ${caption}`}
        >
          <circle
            cx={70}
            cy={70}
            r={r}
            fill="none"
            stroke={GRID}
            strokeWidth={12}
          />
          <circle
            cx={70}
            cy={70}
            r={r}
            fill="none"
            stroke={SERIES[0]}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
            transform="rotate(-90 70 70)"
          />
        </svg>
        <span className="text-admin-ink absolute inset-0 flex items-center justify-center text-2xl font-semibold">
          {percent}%
        </span>
      </div>
      <p className="text-admin-body mt-2 max-w-[220px] text-center text-xs">
        {caption}
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */

type StackedProps = {
  rows: { label: string; values: number[] }[];
  seriesNames: string[];
  format: (n: number) => string;
};

export const StackedBars: FC<StackedProps> = ({
  rows,
  seriesNames,
  format,
}) => {
  const totals = rows.map((r) => r.values.reduce((a, b) => a + b, 0));
  const max = Math.max(...totals, 1);

  return (
    <div>
      <Legend
        items={seriesNames.map((name, i) => ({ name, color: SERIES[i] }))}
      />
      <div className="mt-4 grid gap-3">
        {rows.map((row, ri) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="text-admin-body w-12 shrink-0 text-[11px] tabular-nums">
              {row.label}
            </span>
            {/* 2px surface gaps separate segments instead of borders. */}
            <div
              className="flex h-5 min-w-0 flex-1 gap-0.5"
              style={{ width: `${(totals[ri] / max) * 100}%` }}
            >
              {row.values.map((v, si) => (
                <span
                  key={si}
                  title={`${seriesNames[si]}: ${format(v)}`}
                  className="first:rounded-l-[4px] last:rounded-r-[4px]"
                  style={{
                    background: SERIES[si],
                    flexGrow: v,
                    flexBasis: 0,
                  }}
                />
              ))}
            </div>
            <span className="text-admin-ink w-20 shrink-0 text-right text-[11px] tabular-nums">
              {format(totals[ri])}
            </span>
          </div>
        ))}
      </div>

      <TableTwin
        caption="Số liệu theo tháng và nhóm"
        rowHeader="Tháng"
        columns={seriesNames}
        rows={rows.map((r) => ({
          label: r.label,
          values: r.values.map(format),
        }))}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */

type ProgressProps = {
  rows: { label: string; value: number; display: string }[];
};

export const ProgressList: FC<ProgressProps> = ({ rows }) => {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="grid gap-3">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-admin-ink min-w-0 truncate text-sm">
              {row.label}
            </span>
            <span className="text-admin-body shrink-0 text-xs tabular-nums">
              {row.display}
            </span>
          </div>
          {/* One measure across nominal rows — one hue for every bar, never a
              darker-where-bigger ramp. */}
          <div className="bg-admin-page mt-1.5 h-2 overflow-hidden rounded-full">
            <span
              aria-hidden="true"
              className="block h-full rounded-full"
              style={{
                width: `${(row.value / max) * 100}%`,
                background: SERIES[0],
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

/* ------------------------------------------------------------------ */

type CalendarProps = {
  month: string; // YYYY-MM
  monthLabel: string;
  /** Day-of-month numbers that carry a booking. */
  marked: number[];
};

export const MiniCalendar: FC<CalendarProps> = ({
  month,
  monthLabel,
  marked,
}) => {
  const first = new Date(`${month}-01T00:00:00`);
  const daysInMonth = new Date(
    first.getFullYear(),
    first.getMonth() + 1,
    0
  ).getDate();
  // Monday-first, matching how a Vietnamese week is read.
  const offset = (first.getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const markedSet = new Set(marked);

  return (
    <div>
      <p className="text-admin-ink mb-3 text-center text-sm font-medium">
        {monthLabel}
      </p>
      <div className="text-admin-body grid grid-cols-7 gap-1 text-center text-[11px]">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <span
            key={i}
            className={`flex aspect-square items-center justify-center rounded-full text-xs tabular-nums ${
              day === null
                ? ""
                : markedSet.has(day)
                  ? "font-medium text-white"
                  : "text-admin-body"
            }`}
            style={
              day !== null && markedSet.has(day)
                ? { background: SERIES[0] }
                : undefined
            }
          >
            {day ?? ""}
          </span>
        ))}
      </div>
      <p className="text-admin-body mt-3 flex items-center gap-1.5 text-xs">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full"
          style={{ background: SERIES[0] }}
        />
        Ngày có booking
      </p>
    </div>
  );
};
