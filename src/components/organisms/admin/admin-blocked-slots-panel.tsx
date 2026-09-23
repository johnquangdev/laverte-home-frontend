"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { CalendarOff, CalendarX2, Plus, Trash2 } from "lucide-react";
import type { FC } from "react";

import { EmptyState } from "@/components/atoms/empty-state";
import { LabeledSpinner } from "@/components/atoms/spinner";
import {
  AdminConfirmDialog,
  AdminDialog,
} from "@/components/organisms/admin/admin-dialog";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_FIELD,
  AdminField,
  AdminFormError,
} from "@/components/organisms/admin/admin-form";
import { AdminPageHeader } from "@/components/organisms/admin/admin-page-header";
import {
  useCreateBlockedSlotMutation,
  useDeleteBlockedSlotMutation,
} from "@/hooks/mutations/admin-blocked-slot";
import {
  useAdminHomesQuery,
  useBlockedSlotsQuery,
} from "@/hooks/queries/admin";
import type { BlockedSlotEntity, HomeEntity } from "@/types/api/entities";
import { cn } from "@/utils/common";
import { localInputToIso } from "@/utils/datetime";

const COLS =
  "grid grid-cols-[minmax(260px,1.2fr)_110px_minmax(200px,1fr)_64px] items-center gap-4";

const formatRange = (slot: BlockedSlotEntity): string => {
  const start = dayjs(slot.start_time);
  const end = dayjs(slot.end_time);
  return start.isSame(end, "day")
    ? `${start.format("DD/MM/YYYY HH:mm")} → ${end.format("HH:mm")}`
    : `${start.format("DD/MM/YYYY HH:mm")} → ${end.format("DD/MM/YYYY HH:mm")}`;
};

const formatDuration = (slot: BlockedSlotEntity): string => {
  const hours = dayjs(slot.end_time).diff(dayjs(slot.start_time), "hour", true);
  if (hours < 24) return `${Math.round(hours * 10) / 10} giờ`;
  return `${Math.round((hours / 24) * 10) / 10} ngày`;
};

type CreateProps = {
  home: HomeEntity;
  onClose: () => void;
};

const CreateSlotDialog: FC<CreateProps> = ({ home, onClose }) => {
  const [start, setStart] = useState(() =>
    dayjs().add(1, "hour").startOf("hour").format("YYYY-MM-DDTHH:mm")
  );
  const [end, setEnd] = useState(() =>
    dayjs().add(1, "day").startOf("hour").format("YYYY-MM-DDTHH:mm")
  );
  const [reason, setReason] = useState("");
  const [rangeError, setRangeError] = useState<string>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createSlot = useCreateBlockedSlotMutation();

  const submit = async () => {
    if (!start || !end || !dayjs(end).isAfter(dayjs(start))) {
      setRangeError("Giờ kết thúc phải sau giờ bắt đầu.");
      document.getElementById("slot-end")?.focus();
      return;
    }
    setRangeError(undefined);
    setSubmitError(null);
    try {
      await createSlot.mutateAsync({
        home_id: home.id,
        start_time: localInputToIso(start),
        end_time: localInputToIso(end),
        reason: reason.trim(),
      });
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Khoá lịch thất bại"
      );
    }
  };

  return (
    <AdminDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Khoá lịch ${home.name}`}
      description="Khách không đặt được trong khung này. Booking đã có trong khung vẫn giữ nguyên, hãy xử lý chúng ở Lịch đặt phòng."
      onSubmit={() => void submit()}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className={ADMIN_BTN_SECONDARY}
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={createSlot.isPending}
            className={ADMIN_BTN_PRIMARY}
          >
            {createSlot.isPending ? "Đang khoá…" : "Khoá khung giờ"}
          </button>
        </>
      }
    >
      <div className="grid gap-4">
        <AdminFormError message={submitError} />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField id="slot-start" label="Từ">
            <input
              id="slot-start"
              type="datetime-local"
              name="start_time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className={`${ADMIN_FIELD} tabular-nums`}
            />
          </AdminField>
          <AdminField id="slot-end" label="Đến" error={rangeError}>
            <input
              id="slot-end"
              type="datetime-local"
              name="end_time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              aria-invalid={rangeError ? true : undefined}
              aria-describedby={rangeError ? "slot-end-error" : undefined}
              className={`${ADMIN_FIELD} tabular-nums`}
            />
          </AdminField>
        </div>
        <AdminField
          id="slot-reason"
          label="Lý do"
          hint="Chỉ admin thấy, khách chỉ thấy khung giờ đã kín."
        >
          <input
            id="slot-reason"
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Bảo trì điều hoà…"
            autoComplete="off"
            aria-describedby="slot-reason-hint"
            className={ADMIN_FIELD}
          />
        </AdminField>
      </div>
    </AdminDialog>
  );
};

export const AdminBlockedSlotsPanel: FC = () => {
  const homesQuery = useAdminHomesQuery();
  const homes = useMemo(() => homesQuery.data ?? [], [homesQuery.data]);

  const [pickedHomeId, setPickedHomeId] = useState<number>();
  const homeId = pickedHomeId ?? homes[0]?.id;
  const home = homes.find((h) => h.id === homeId);

  const slotsQuery = useBlockedSlotsQuery(homeId);
  const [showPast, setShowPast] = useState(false);
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState<BlockedSlotEntity | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const deleteSlot = useDeleteBlockedSlotMutation();

  const { upcoming, past } = useMemo(() => {
    const now = dayjs();
    const all = slotsQuery.data ?? [];
    return {
      upcoming: all.filter((s) => dayjs(s.end_time).isAfter(now)),
      past: all.filter((s) => !dayjs(s.end_time).isAfter(now)),
    };
  }, [slotsQuery.data]);
  const visible = showPast ? [...past, ...upcoming] : upcoming;

  const confirmRemove = async () => {
    if (!removing) return;
    setRemoveError(null);
    try {
      await deleteSlot.mutateAsync(removing.id);
      setRemoving(null);
    } catch (error) {
      setRemoveError(
        error instanceof Error ? error.message : "Mở khoá thất bại"
      );
    }
  };

  const error = homesQuery.error ?? slotsQuery.error;

  return (
    <div className="grid gap-5">
      <AdminPageHeader
        title="Khoá lịch"
        actions={
          <>
            <label className="flex items-center gap-2">
              <span className="text-admin-body text-sm">Phòng</span>
              <select
                value={homeId ?? ""}
                onChange={(e) => setPickedHomeId(Number(e.target.value))}
                disabled={homes.length === 0}
                className={cn(ADMIN_FIELD, "min-h-control-md w-auto")}
              >
                {homes.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setCreating(true)}
              disabled={!home}
              className={ADMIN_BTN_PRIMARY}
            >
              <Plus aria-hidden="true" className="size-4" />
              Khoá khung giờ
            </button>
          </>
        }
      />

      {error ? (
        <p className="text-danger-fg text-sm" aria-live="polite">
          {error.message}
        </p>
      ) : null}

      {homesQuery.isLoading || slotsQuery.isLoading ? (
        <LabeledSpinner>Đang tải…</LabeledSpinner>
      ) : homes.length === 0 ? (
        <div className="border-admin-line rounded-card border">
          <EmptyState
            icon={CalendarX2}
            title="Chưa có phòng nào"
            description="Tạo phòng trong màn Phòng trước rồi mới khoá lịch được."
          />
        </div>
      ) : (
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-admin-body text-sm tabular-nums">
              {upcoming.length} khung đang hoặc sắp khoá
            </p>
            {past.length > 0 ? (
              <label className="min-h-control-md text-admin-body flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showPast}
                  onChange={(e) => setShowPast(e.target.checked)}
                  className="accent-admin-accent size-4"
                />
                Hiện {past.length} khung đã qua
              </label>
            ) : null}
          </div>

          <div className="border-admin-line rounded-card bg-admin-card overflow-hidden border shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
            <div className="overflow-x-auto">
              <div className="min-w-[680px]">
                <div className={`${COLS} bg-admin-page px-4 py-2.5`}>
                  {["Khung giờ", "Thời lượng", "Lý do"].map((h) => (
                    <span
                      key={h}
                      className="text-admin-body text-xs font-medium"
                    >
                      {h}
                    </span>
                  ))}
                  <span className="sr-only">Thao tác</span>
                </div>

                {visible.length === 0 ? (
                  <div className="border-admin-line border-t">
                    <EmptyState
                      icon={CalendarOff}
                      title="Không có khung giờ nào đang khoá"
                      description="Khoá lịch khi cần bảo trì, giữ chỗ cho khách quen hoặc nghỉ lễ."
                    />
                  </div>
                ) : (
                  visible.map((slot) => {
                    const isPast = !dayjs(slot.end_time).isAfter(dayjs());
                    return (
                      <div
                        key={slot.id}
                        className={`${COLS} border-admin-line hover:bg-admin-page/60 border-t px-4 py-3 transition-colors`}
                      >
                        <p
                          className={`text-sm tabular-nums ${isPast ? "text-admin-body" : "text-admin-ink"}`}
                        >
                          {formatRange(slot)}
                        </p>
                        <p className="text-admin-body text-sm tabular-nums">
                          {formatDuration(slot)}
                        </p>
                        <p className="text-admin-ink min-w-0 truncate text-sm">
                          {slot.reason || (
                            <span className="text-admin-body">—</span>
                          )}
                        </p>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setRemoveError(null);
                              setRemoving(slot);
                            }}
                            aria-label={`Mở khoá ${formatRange(slot)}`}
                            className="rounded-field text-admin-body hover:text-danger-fg hover:bg-state-cancelled focus-visible:ring-admin-accent flex size-11 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
                          >
                            <Trash2 aria-hidden="true" className="size-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {creating && home ? (
        <CreateSlotDialog home={home} onClose={() => setCreating(false)} />
      ) : null}

      <AdminConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
        title="Mở khoá khung giờ này?"
        description={
          removing
            ? `${formatRange(removing)} sẽ mở lại cho khách đặt ngay.`
            : ""
        }
        confirmLabel="Mở khoá"
        pending={deleteSlot.isPending}
        error={removeError}
        onConfirm={() => void confirmRemove()}
      />
    </div>
  );
};
