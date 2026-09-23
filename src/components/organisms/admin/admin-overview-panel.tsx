"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { FC } from "react";

import { LabeledSpinner } from "@/components/atoms/spinner";
import { StatTile } from "@/components/atoms/stat-tile";
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
import { useOverviewBreakdownQuery } from "@/hooks/queries/admin";
import type { OverviewMonthEntity } from "@/types/api/entities";
import { compactVnd, formatPercent, percentChange } from "@/utils/chart";
import { formatVnd } from "@/utils/common";

const MONTHS_SHOWN = 6;
const TYPE_MONTHS_SHOWN = 4;

const shortLabel = (m: OverviewMonthEntity) =>
  dayjs(`${m.month}-01`).format("MM/YY");
const fullLabel = (m: OverviewMonthEntity) =>
  `Tháng ${dayjs(`${m.month}-01`).format("MM/YYYY")}`;

export const AdminOverviewPanel: FC = () => {
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const query = useOverviewBreakdownQuery(month);
  const data = query.data;

  const view = useMemo(() => {
    if (!data) return undefined;
    const months = data.months;
    const recent = months.slice(-MONTHS_SHOWN);
    const current = months.at(-1);
    const previous = months.at(-2);
    return {
      recent,
      current,
      previous,
      revenuePoints: recent.map<MonthlyPoint>((m) => ({
        label: shortLabel(m),
        fullLabel: fullLabel(m),
        value: m.revenue_vnd,
      })),
      bookingPoints: recent.map<MonthlyPoint>((m) => ({
        label: shortLabel(m),
        fullLabel: fullLabel(m),
        value: m.booking_count,
      })),
      // The series is 24 months ending at the selected one, so its two halves
      // are this year and the same twelve months a year earlier.
      yearLabels: months.slice(12).map(shortLabel),
      yearThis: months.slice(12).map((m) => m.revenue_vnd),
      yearLast: months.slice(0, 12).map((m) => m.revenue_vnd),
      typeRows: months.slice(-TYPE_MONTHS_SHOWN).map((m) => ({
        label: `T${dayjs(`${m.month}-01`).format("M")}`,
        values: [m.hourly_count, m.overnight_count, m.day_count],
      })),
      totalRevenue: recent.reduce((sum, m) => sum + m.revenue_vnd, 0),
      topHomes: data.homes.map((h) => ({
        label: h.name,
        value: h.occupancy_percent,
        display: formatPercent(h.occupancy_percent),
      })),
    };
  }, [data]);

  return (
    <div className="grid gap-5">
      <AdminPageHeader
        title="Overview"
        actions={
          <label className="flex items-center gap-2">
            <span className="text-admin-body text-sm">Tháng</span>
            <input
              type="month"
              value={month}
              onChange={(e) => {
                if (e.target.value) setMonth(e.target.value);
              }}
              className="border-admin-field rounded-field min-h-control-md text-admin-ink focus-visible:ring-admin-accent border px-3 text-base focus-visible:ring-2 focus-visible:outline-none"
            />
          </label>
        }
      />

      {query.error ? (
        <p className="text-danger-fg text-sm" aria-live="polite">
          {query.error.message}
        </p>
      ) : null}

      {query.isLoading || !view || !data ? (
        query.error ? null : (
          <LabeledSpinner>Đang tải…</LabeledSpinner>
        )
      ) : (
        <div
          className={`grid gap-5 transition-opacity ${query.isFetching ? "opacity-60" : ""}`}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              hero
              label="Doanh thu tháng"
              value={compactVnd(view.current?.revenue_vnd ?? 0)}
              delta={
                view.current && view.previous
                  ? percentChange(
                      view.current.revenue_vnd,
                      view.previous.revenue_vnd
                    )
                  : undefined
              }
              hint={formatVnd(view.current?.revenue_vnd ?? 0)}
              spark={view.recent.map((m) => m.revenue_vnd)}
            />
            <StatTile
              label="Số booking"
              value={String(view.current?.booking_count ?? 0)}
              delta={
                view.current && view.previous
                  ? percentChange(
                      view.current.booking_count,
                      view.previous.booking_count
                    )
                  : undefined
              }
              hint={view.current ? fullLabel(view.current) : undefined}
              spark={view.recent.map((m) => m.booking_count)}
            />
            <StatTile
              label="Tỉ lệ lấp phòng"
              value={formatPercent(data.occupancy_percent)}
              hint={`${data.booked_days.length} ngày có khách`}
            />
            <StatTile
              label={`Doanh thu ${MONTHS_SHOWN} tháng`}
              value={compactVnd(view.totalRevenue)}
              hint={
                view.recent.length
                  ? `${shortLabel(view.recent[0])} → ${shortLabel(view.recent[view.recent.length - 1])}`
                  : undefined
              }
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <ChartCard
              title="Doanh thu 12 tháng — năm nay so với năm trước"
              className="xl:col-span-2"
            >
              <LineChartPair
                labels={view.yearLabels}
                series={[
                  { name: "12 tháng gần nhất", values: view.yearThis },
                  { name: "Cùng kỳ năm trước", values: view.yearLast },
                ]}
                format={compactVnd}
              />
            </ChartCard>

            <ChartCard title="Tỉ lệ lấp phòng">
              <Donut
                percent={data.occupancy_percent}
                caption="Số giờ có khách chia tổng số giờ của các phòng đang mở trong tháng"
              />
            </ChartCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <MonthlyBarChart
              title="Doanh thu theo tháng"
              data={view.revenuePoints}
              format={compactVnd}
              tableCaption="Doanh thu theo từng tháng"
            />
            <MonthlyBarChart
              title="Số booking theo tháng"
              data={view.bookingPoints}
              format={(v) => String(Math.round(v))}
              tableCaption="Số booking theo từng tháng"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <ChartCard title="Lịch trong tháng">
              <MiniCalendar
                month={month}
                monthLabel={dayjs(`${month}-01`).format("MM/YYYY")}
                marked={data.booked_days}
              />
            </ChartCard>

            <ChartCard title="Booking theo loại">
              <StackedBars
                rows={view.typeRows}
                seriesNames={["Theo giờ", "Qua đêm", "Theo ngày"]}
                format={(n) => String(n)}
              />
            </ChartCard>

            <ChartCard title="Phòng dùng nhiều nhất">
              {view.topHomes.length > 0 ? (
                <ProgressList rows={view.topHomes} />
              ) : (
                <p className="text-admin-body text-sm">
                  Chưa có phòng nào đang mở trong tháng này.
                </p>
              )}
            </ChartCard>
          </div>
        </div>
      )}

      <p className="text-admin-body max-w-3xl text-xs leading-relaxed">
        Doanh thu tính theo ngày tiền về, số booking và tỉ lệ lấp phòng tính
        theo giờ nhận phòng, nên một booking trả tiền cuối tháng này cho kỳ nghỉ
        tháng sau sẽ nằm ở hai tháng khác nhau. Khoản đã hoàn tiền không tính
        vào doanh thu.
      </p>
    </div>
  );
};
