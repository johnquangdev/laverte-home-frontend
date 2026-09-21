"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { FC } from "react";

import { LabeledSpinner } from "@/components/atoms/spinner";
import { StatTile } from "@/components/atoms/stat-tile";
import { Switch } from "@/components/atoms/switch";
import { AdminPageHeader } from "@/components/organisms/admin/admin-page-header";
import {
  ChartCard,
  Donut,
  LineChartPair,
  MiniCalendar,
  ProgressList,
  StackedBars,
} from "@/components/organisms/admin/charts";
import type { MonthlyPoint } from "@/components/organisms/admin/monthly-bar-chart";
import { MonthlyBarChart } from "@/components/organisms/admin/monthly-bar-chart";
import { useMonthlyOverviewQueries } from "@/hooks/queries/admin";
import { compactVnd, percentChange } from "@/utils/chart";
import { formatVnd } from "@/utils/common";

const MONTHS_SHOWN = 6;
const M = 1_000_000;

/**
 * Sample figures sized to a real month at La Verte — around 200tr against
 * ~120 bookings, so roughly 1,7tr each. Fixed arrays rather than random values:
 * random breaks hydration and makes the charts twitch on every render.
 */
const SAMPLE = {
  revenue: [164 * M, 178.5 * M, 171.2 * M, 195.8 * M, 188.4 * M, 203.6 * M],
  bookings: [96, 108, 101, 118, 112, 121],
  yearThis: [142, 155, 149, 168, 161, 176, 184, 179, 195, 188, 199, 204].map(
    (v) => v * M
  ),
  yearLast: [108, 116, 121, 119, 132, 128, 141, 147, 144, 158, 152, 163].map(
    (v) => v * M
  ),
  occupancy: 78,
  roomTypeSplit: [
    { label: "T6", values: [38, 21, 9] },
    { label: "T7", values: [44, 26, 12] },
    { label: "T8", values: [49, 24, 15] },
    { label: "T9", values: [52, 31, 18] },
  ],
  topRooms: [
    { label: "La Verte Nest 01", value: 92, display: "92%" },
    { label: "La Verte Home 02", value: 81, display: "81%" },
    { label: "La Verte Nest 02", value: 67, display: "67%" },
    { label: "La Verte Home 01", value: 44, display: "44%" },
  ],
  bookedDays: [2, 3, 5, 6, 9, 10, 11, 14, 16, 17, 18, 21, 23, 24, 25, 28, 30],
};

export const AdminOverviewPanel: FC = () => {
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  // On by default: the database is still empty, and a wall of zeroes says
  // nothing about whether the screen works.
  const [sample, setSample] = useState(true);

  const ranges = useMemo(() => {
    const end = dayjs(`${month}-01`);
    return Array.from({ length: MONTHS_SHOWN }, (_, i) => {
      const start = end.subtract(MONTHS_SHOWN - 1 - i, "month");
      return {
        from: start.format("YYYY-MM-01"),
        to: start.endOf("month").format("YYYY-MM-DD"),
        label: start.format("MM/YY"),
        fullLabel: `Tháng ${start.format("MM/YYYY")}`,
      };
    });
  }, [month]);

  const results = useMonthlyOverviewQueries(
    ranges.map(({ from, to }) => ({ from, to }))
  );

  const isLoading = !sample && results.some((r) => r.isLoading);
  const isFetching = !sample && results.some((r) => r.isFetching);
  const firstError = sample ? undefined : results.find((r) => r.error)?.error;
  const dataKey = results.map((r) => r.data?.total_revenue_vnd ?? "").join("|");

  const series = useMemo(
    () =>
      ranges.map((range, i) => ({
        ...range,
        revenue: sample
          ? (SAMPLE.revenue[i] ?? 0)
          : (results[i]?.data?.total_revenue_vnd ?? 0),
        bookings: sample
          ? (SAMPLE.bookings[i] ?? 0)
          : (results[i]?.data?.booking_count ?? 0),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- useQueries returns a fresh array each render; dataKey tracks the values that matter
    [ranges, dataKey, sample]
  );

  const current = series.at(-1);
  const previous = series.at(-2);

  const revenuePoints: MonthlyPoint[] = series.map((s) => ({
    label: s.label,
    fullLabel: s.fullLabel,
    value: s.revenue,
  }));
  const bookingPoints: MonthlyPoint[] = series.map((s) => ({
    label: s.label,
    fullLabel: s.fullLabel,
    value: s.bookings,
  }));

  const average =
    current && current.bookings > 0
      ? Math.round(current.revenue / current.bookings)
      : 0;
  const totalRevenue = series.reduce((sum, s) => sum + s.revenue, 0);

  const yearLabels = useMemo(() => {
    const end = dayjs(`${month}-01`);
    return Array.from({ length: 12 }, (_, i) =>
      end.subtract(11 - i, "month").format("MM/YY")
    );
  }, [month]);

  return (
    <div className="grid gap-5">
      <AdminPageHeader
        title="Overview"
        actions={
          <>
            <Switch checked={sample} onChange={setSample} label="Dữ liệu mẫu" />
            <label className="flex items-center gap-2">
              <span className="text-admin-body text-sm">Tháng</span>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border-admin-field rounded-field min-h-control-md text-admin-ink focus-visible:ring-admin-accent border px-3 text-base focus-visible:ring-2 focus-visible:outline-none"
              />
            </label>
          </>
        }
      />

      {firstError ? (
        <p className="text-danger-fg text-sm" aria-live="polite">
          {firstError.message}
        </p>
      ) : null}

      {isLoading ? (
        <LabeledSpinner>Đang tải…</LabeledSpinner>
      ) : (
        <div
          className={`grid gap-5 transition-opacity ${isFetching ? "opacity-60" : ""}`}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              hero
              label="Doanh thu tháng"
              value={compactVnd(current?.revenue ?? 0)}
              delta={
                current && previous
                  ? percentChange(current.revenue, previous.revenue)
                  : undefined
              }
              hint={formatVnd(current?.revenue ?? 0)}
              spark={series.map((s) => s.revenue)}
            />
            <StatTile
              label="Số booking"
              value={String(current?.bookings ?? 0)}
              delta={
                current && previous
                  ? percentChange(current.bookings, previous.bookings)
                  : undefined
              }
              hint={current?.fullLabel}
              spark={series.map((s) => s.bookings)}
            />
            <StatTile
              label="Trung bình / booking"
              value={compactVnd(average)}
              hint={formatVnd(average)}
            />
            <StatTile
              label={`Doanh thu ${MONTHS_SHOWN} tháng`}
              value={compactVnd(totalRevenue)}
              hint={`${ranges[0].label} → ${ranges.at(-1)?.label}`}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <ChartCard
              title="Doanh thu 12 tháng — năm nay so với năm trước"
              sample
              className="xl:col-span-2"
            >
              <LineChartPair
                labels={yearLabels}
                series={[
                  { name: "Năm nay", values: SAMPLE.yearThis },
                  { name: "Năm trước", values: SAMPLE.yearLast },
                ]}
                format={compactVnd}
              />
            </ChartCard>

            <ChartCard title="Tỉ lệ lấp phòng" sample>
              <Donut
                percent={SAMPLE.occupancy}
                caption="Số đêm đã bán chia số đêm có thể bán trong tháng"
              />
            </ChartCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <MonthlyBarChart
              title="Doanh thu theo tháng"
              data={revenuePoints}
              format={compactVnd}
              tableCaption="Doanh thu theo từng tháng"
              sample={sample}
            />
            <MonthlyBarChart
              title="Số booking theo tháng"
              data={bookingPoints}
              format={(v) => String(Math.round(v))}
              tableCaption="Số booking theo từng tháng"
              sample={sample}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <ChartCard title="Lịch trong tháng" sample>
              <MiniCalendar
                month={month}
                monthLabel={dayjs(`${month}-01`).format("MM/YYYY")}
                marked={SAMPLE.bookedDays}
              />
            </ChartCard>

            <ChartCard title="Booking theo loại" sample>
              <StackedBars
                rows={SAMPLE.roomTypeSplit}
                seriesNames={["Theo giờ", "Qua đêm", "Theo ngày"]}
                format={(n) => String(n)}
              />
            </ChartCard>

            <ChartCard title="Phòng dùng nhiều nhất" sample>
              <ProgressList rows={SAMPLE.topRooms} />
            </ChartCard>
          </div>
        </div>
      )}

      <p className="text-admin-body max-w-3xl text-xs leading-relaxed">
        Tắt công tắc <span className="text-admin-ink">Dữ liệu mẫu</span> để bốn
        thẻ trên cùng và hai biểu đồ cột đọc số thật từ{" "}
        <code>GET /admin/overview</code>. Các panel còn lại luôn là số mẫu vì
        chưa có endpoint: tỉ lệ lấp phòng, so cùng kỳ năm trước, tách theo loại
        booking và theo từng phòng.
      </p>
    </div>
  );
};
