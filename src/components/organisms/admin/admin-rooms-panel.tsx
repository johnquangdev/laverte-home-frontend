"use client";

import { useState } from "react";
import { BedDouble, CalendarCheck2, Pencil, Plus } from "lucide-react";
import type { FC } from "react";

import { EmptyState } from "@/components/atoms/empty-state";
import { LabeledSpinner } from "@/components/atoms/spinner";
import { Switch } from "@/components/atoms/switch";
import { AdminDialog } from "@/components/organisms/admin/admin-dialog";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_FIELD,
  AdminField,
  AdminFormError,
} from "@/components/organisms/admin/admin-form";
import { AdminPageHeader } from "@/components/organisms/admin/admin-page-header";
import { HOME_CATEGORY_LABELS } from "@/constants/admin";
import {
  useCreateHomeMutation,
  useUpdateHomeMutation,
} from "@/hooks/mutations/admin-home";
import { useAdminHomesQuery } from "@/hooks/queries/admin";
import type { HomeCategory, HomeEntity } from "@/types/api/entities";

const COLS =
  "grid grid-cols-[minmax(200px,1.2fr)_minmax(160px,1fr)_150px_200px_48px] items-center gap-4";

type FormState = {
  name: string;
  category: HomeCategory;
  address: string;
  description: string;
  googleCalendarId: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  category: "home",
  address: "",
  description: "",
  googleCalendarId: "",
};

const toForm = (home: HomeEntity): FormState => ({
  name: home.name,
  category: home.category,
  address: home.address,
  description: home.description,
  googleCalendarId: home.google_calendar_id,
});

type DialogProps = {
  /** Undefined opens the dialog in create mode. */
  home: HomeEntity | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const HomeFormDialog: FC<DialogProps> = ({ home, open, onOpenChange }) => {
  const [form, setForm] = useState<FormState>(() =>
    home ? toForm(home) : EMPTY_FORM
  );
  const [nameError, setNameError] = useState<string>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createHome = useCreateHomeMutation();
  const updateHome = useUpdateHomeMutation();
  const pending = createHome.isPending || updateHome.isPending;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!form.name.trim()) {
      setNameError("Nhập tên phòng, ví dụ “La Verte Thảo Điền”.");
      document.getElementById("home-name")?.focus();
      return;
    }
    setNameError(undefined);
    setSubmitError(null);

    const base = {
      name: form.name.trim(),
      category: form.category,
      address: form.address.trim(),
      description: form.description.trim(),
    };
    try {
      if (home) {
        await updateHome.mutateAsync({
          id: home.id,
          payload: {
            ...base,
            google_calendar_id: form.googleCalendarId.trim(),
          },
        });
      } else {
        await createHome.mutateAsync(base);
      }
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Lưu phòng thất bại"
      );
    }
  };

  return (
    <AdminDialog
      open={open}
      onOpenChange={onOpenChange}
      title={home ? `Sửa ${home.name}` : "Thêm phòng"}
      onSubmit={() => void submit()}
      footer={
        <>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={ADMIN_BTN_SECONDARY}
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={pending}
            className={ADMIN_BTN_PRIMARY}
          >
            {pending ? "Đang lưu…" : home ? "Lưu thay đổi" : "Tạo phòng"}
          </button>
        </>
      }
    >
      <div className="grid gap-4">
        <AdminFormError message={submitError} />

        <AdminField id="home-name" label="Tên phòng" error={nameError}>
          <input
            id="home-name"
            name="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="La Verte Thảo Điền…"
            autoComplete="off"
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "home-name-error" : undefined}
            className={ADMIN_FIELD}
          />
        </AdminField>

        <AdminField
          id="home-category"
          label="Hạng"
          hint="Bảng giá áp theo hạng, không theo từng phòng."
        >
          <select
            id="home-category"
            name="category"
            value={form.category}
            onChange={(e) => set("category", e.target.value as HomeCategory)}
            aria-describedby="home-category-hint"
            className={ADMIN_FIELD}
          >
            {(Object.keys(HOME_CATEGORY_LABELS) as HomeCategory[]).map((c) => (
              <option key={c} value={c}>
                {HOME_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField id="home-address" label="Địa chỉ">
          <input
            id="home-address"
            name="address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="12 Nguyễn Văn Hưởng, Thảo Điền…"
            autoComplete="off"
            className={ADMIN_FIELD}
          />
        </AdminField>

        <AdminField id="home-description" label="Mô tả">
          <textarea
            id="home-description"
            name="description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            className={`${ADMIN_FIELD} py-2.5`}
          />
        </AdminField>

        {home ? (
          <AdminField
            id="home-calendar"
            label="Google Calendar ID"
            hint="Booking đã xác nhận sẽ được đẩy lên lịch này. Để trống nếu không dùng."
          >
            <input
              id="home-calendar"
              name="google_calendar_id"
              value={form.googleCalendarId}
              onChange={(e) => set("googleCalendarId", e.target.value)}
              placeholder="abc123@group.calendar.google.com…"
              autoComplete="off"
              spellCheck={false}
              aria-describedby="home-calendar-hint"
              className={ADMIN_FIELD}
            />
          </AdminField>
        ) : (
          <p className="text-admin-body text-xs">
            Gắn Google Calendar sau khi tạo, bằng nút Sửa.
          </p>
        )}
      </div>
    </AdminDialog>
  );
};

const HomeRow: FC<{ home: HomeEntity; onEdit: () => void }> = ({
  home,
  onEdit,
}) => {
  const updateHome = useUpdateHomeMutation();
  const [error, setError] = useState<string | null>(null);

  const toggleActive = async (isActive: boolean) => {
    setError(null);
    try {
      // PUT replaces the descriptive fields outright, so they ride along unchanged.
      await updateHome.mutateAsync({
        id: home.id,
        payload: {
          name: home.name,
          category: home.category,
          address: home.address,
          description: home.description,
          is_active: isActive,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đổi trạng thái thất bại");
    }
  };

  return (
    <div className="border-admin-line hover:bg-admin-page/60 border-t transition-colors">
      <div className={`${COLS} px-4 py-3`}>
        <div className="min-w-0">
          <p className="text-admin-ink truncate text-sm font-medium">
            {home.name}
          </p>
          <p className="text-admin-body mt-0.5 text-xs">
            #{home.id} · {HOME_CATEGORY_LABELS[home.category] ?? home.category}
          </p>
        </div>

        <p className="text-admin-body line-clamp-2 min-w-0 text-sm break-words">
          {home.address || "—"}
        </p>

        {home.google_calendar_id ? (
          <span className="text-state-paid-fg flex items-center gap-1.5 text-sm">
            <CalendarCheck2 aria-hidden="true" className="size-4 shrink-0" />
            Đã gắn lịch
          </span>
        ) : (
          <span className="text-admin-body text-sm">Chưa gắn lịch</span>
        )}

        <Switch
          checked={home.is_active}
          onChange={(v) => void toggleActive(v)}
          label={home.is_active ? "Đang nhận khách" : "Tạm ngưng"}
          ariaLabel={`Nhận khách cho ${home.name}`}
          disabled={updateHome.isPending}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Sửa ${home.name}`}
            className="rounded-field text-admin-body hover:text-admin-ink hover:bg-admin-page focus-visible:ring-admin-accent flex size-11 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <Pencil aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
      {error ? (
        <p className="text-danger-fg px-4 pb-3 text-xs" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export const AdminRoomsPanel: FC = () => {
  const homesQuery = useAdminHomesQuery();
  const homes = homesQuery.data ?? [];

  // `editing` doubles as the dialog's key: a fresh mount per open resets the
  // form to the row being edited instead of the last one typed into.
  const [editing, setEditing] = useState<HomeEntity | "new" | null>(null);

  return (
    <div className="grid gap-5">
      <AdminPageHeader
        title="Phòng"
        actions={
          <button
            type="button"
            onClick={() => setEditing("new")}
            className={ADMIN_BTN_PRIMARY}
          >
            <Plus aria-hidden="true" className="size-4" />
            Thêm phòng
          </button>
        }
      />

      {homesQuery.error ? (
        <p className="text-danger-fg text-sm" aria-live="polite">
          {homesQuery.error.message}
        </p>
      ) : null}

      {homesQuery.isLoading ? (
        <LabeledSpinner>Đang tải…</LabeledSpinner>
      ) : homes.length === 0 ? (
        <div className="border-admin-line rounded-card border">
          <EmptyState
            icon={BedDouble}
            title="Chưa có phòng nào"
            description="Thêm phòng đầu tiên để khách bắt đầu đặt được."
          />
        </div>
      ) : (
        <div className="border-admin-line rounded-card bg-admin-card overflow-hidden border shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[840px]">
              <div className={`${COLS} bg-admin-page px-4 py-2.5`}>
                {["Phòng", "Địa chỉ", "Google Calendar", "Trạng thái"].map(
                  (h) => (
                    <span
                      key={h}
                      className="text-admin-body text-xs font-medium"
                    >
                      {h}
                    </span>
                  )
                )}
                <span className="sr-only">Thao tác</span>
              </div>
              {homes.map((home) => (
                <HomeRow
                  key={home.id}
                  home={home}
                  onEdit={() => setEditing(home)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {editing ? (
        <HomeFormDialog
          key={editing === "new" ? "new" : editing.id}
          home={editing === "new" ? undefined : editing}
          open
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
};
