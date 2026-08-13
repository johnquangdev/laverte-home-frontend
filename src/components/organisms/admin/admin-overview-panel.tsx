"use client";

import { useState } from "react";
import dayjs from "dayjs";
import type { FC } from "react";

import { Heading } from "@/components/atoms/heading";
import { LabeledSpinner } from "@/components/atoms/spinner";
import { useAdminOverviewQuery } from "@/hooks/queries/admin";
import { formatVnd } from "@/utils/common";

export const AdminOverviewPanel: FC = () => {
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const from = `${month}-01`;
  const to = dayjs(from).endOf("month").format("YYYY-MM-DD");

  const overviewQuery = useAdminOverviewQuery(from, to);

  return (
    <div className="grid gap-6">
      <Heading level={1} className="text-3xl text-emerald-950">
        Doanh thu
      </Heading>
      <label className="grid max-w-xs gap-1 text-sm">
        <span className="font-medium">Tháng</span>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-emerald-200 px-3 py-2"
        />
      </label>
      {overviewQuery.error ? (
        <p className="text-sm text-red-600">{overviewQuery.error.message}</p>
      ) : null}
      {overviewQuery.isLoading ? (
        <LabeledSpinner>Đang tải…</LabeledSpinner>
      ) : overviewQuery.data ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-emerald-800/70">Doanh thu</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-950">
              {formatVnd(overviewQuery.data.total_revenue_vnd)}
            </p>
          </article>
          <article className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-emerald-800/70">Số booking</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-950">
              {overviewQuery.data.booking_count}
            </p>
          </article>
        </div>
      ) : null}
    </div>
  );
};
