import type { FC } from "react";

export type MonthlyPoint = {
  /** Short axis label, e.g. "09/26". */
  label: string;
  /** Full label for the tooltip and the table twin. */
  fullLabel: string;
  value: number;
};

type Props = {
  title: string;
  data: MonthlyPoint[];
  format: (value: number) => string;
  /** Screen-reader name for the table twin. */
  tableCaption: string;
  /** Marks the panel as drawn from sample numbers rather than the API. */
  sample?: boolean;
};

const PLOT_HEIGHT = 168;

export const MonthlyBarChart: FC<Props> = ({
  title,
  data,
  format,
  tableCaption,
  sample,
}) => {
  const max = Math.max(...data.map((d) => d.value), 0);
  // A flat-zero month set would divide by zero; the bars simply render empty.
  const scale = (value: number) => (max > 0 ? (value / max) * 100 : 0);
  const ticks = [max, max / 2, 0];
  const last = data.at(-1);

  return (
    <section className="border-admin-line rounded-card bg-admin-card border p-4 shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
      <div className="flex items-center gap-2">
        <h3 className="text-admin-ink text-sm font-medium">{title}</h3>
        {sample ? (
          <span className="border-admin-line text-admin-body rounded-pill border px-2 py-0.5 text-[10px] font-medium">
            dữ liệu mẫu
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex gap-3">
        {/* Axis ticks are tabular so they align vertically. */}
        <div
          aria-hidden="true"
          className="text-admin-body flex w-14 shrink-0 flex-col justify-between text-right text-[11px] tabular-nums"
          style={{ height: PLOT_HEIGHT }}
        >
          {ticks.map((t, i) => (
            <span key={i}>{format(t)}</span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height: PLOT_HEIGHT }}>
            {/* Hairline grid, one shade off the surface — solid, never dashed. */}
            {[0, 50, 100].map((pct) => (
              <span
                key={pct}
                aria-hidden="true"
                className="bg-admin-line absolute inset-x-0 h-px"
                style={{ top: `${pct}%` }}
              />
            ))}

            <div className="absolute inset-0 flex items-end gap-2">
              {data.map((point) => {
                const isLast = point.label === last?.label;
                return (
                  <button
                    key={point.label}
                    type="button"
                    aria-label={`${point.fullLabel}: ${format(point.value)}`}
                    className="group/bar focus-visible:ring-admin-accent relative flex h-full min-w-6 flex-1 cursor-default items-end rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className={`w-full rounded-t-[4px] transition-opacity ${
                        isLast ? "bg-admin-accent" : "bg-admin-accent/70"
                      } group-hover/bar:opacity-100`}
                      style={{ height: `${scale(point.value)}%` }}
                    />
                    {/* Tooltip enhances; the same value is in the table twin
                        below and, for the latest month, printed above the bar. */}
                    <span
                      role="presentation"
                      className="bg-admin-ink pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 rounded-md px-2 py-1 text-[11px] whitespace-nowrap text-white group-hover/bar:block group-focus-visible/bar:block"
                    >
                      {point.fullLabel}: {format(point.value)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="text-admin-body mt-2 flex gap-2 text-[11px]"
          >
            {data.map((point) => (
              <span
                key={point.label}
                className="min-w-6 flex-1 text-center tabular-nums"
              >
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {last ? (
        <p className="text-admin-body mt-3 text-xs">
          Tháng gần nhất:{" "}
          <span className="text-admin-ink font-medium">
            {format(last.value)}
          </span>
        </p>
      ) : null}

      <table className="sr-only">
        <caption>{tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">Tháng</th>
            <th scope="col">Giá trị</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.fullLabel}</th>
              <td>{format(point.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
