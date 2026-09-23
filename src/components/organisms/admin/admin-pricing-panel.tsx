"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import type { FC } from "react";

import { LabeledSpinner } from "@/components/atoms/spinner";
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
  useCreatePricingRuleMutation,
  useSupersedePricingRuleMutation,
} from "@/hooks/mutations/admin-pricing";
import { usePricingRulesQuery } from "@/hooks/queries/admin";
import type { UpsertPricingRuleRequest } from "@/types/api/dtos";
import type {
  BookingType,
  HomeCategory,
  PricingRuleEntity,
} from "@/types/api/entities";
import { formatVnd } from "@/utils/common";

const RULE_TYPES: { type: BookingType; label: string; blurb: string }[] = [
  {
    type: "hourly",
    label: "Theo giờ",
    blurb: "Gói giờ đầu, sau đó tính thêm từng giờ. Giờ lẻ tính tròn 1 giờ.",
  },
  {
    type: "overnight",
    label: "Qua đêm",
    blurb:
      "Một giá cho mỗi 24 giờ, chỉ nhận khi giờ vào phòng nằm trong khung cho phép.",
  },
  {
    type: "day",
    label: "Theo ngày",
    blurb: "Một giá cho mỗi 24 giờ, vào phòng giờ nào cũng được.",
  },
];

const summarize = (rule: PricingRuleEntity): string => {
  switch (rule.rule_type) {
    case "hourly":
      return `${rule.base_hours ?? "?"} giờ đầu ${formatVnd(rule.base_price ?? 0)} · thêm ${formatVnd(rule.extra_hour_price ?? 0)}/giờ`;
    case "overnight":
      return `${formatVnd(rule.flat_price ?? 0)}/đêm · vào phòng ${rule.window_start ?? "?"}–${rule.window_end ?? "?"}`;
    default:
      return `${formatVnd(rule.flat_price ?? 0)}/ngày`;
  }
};

type FormState = {
  baseHours: string;
  basePrice: string;
  extraHourPrice: string;
  flatPrice: string;
  windowStart: string;
  windowEnd: string;
};

const toForm = (rule: PricingRuleEntity | undefined): FormState => ({
  baseHours: rule?.base_hours?.toString() ?? "",
  basePrice: rule?.base_price?.toString() ?? "",
  extraHourPrice: rule?.extra_hour_price?.toString() ?? "",
  flatPrice: rule?.flat_price?.toString() ?? "",
  windowStart: rule?.window_start ?? "22:00",
  windowEnd: rule?.window_end ?? "06:00",
});

type Errors = Partial<Record<keyof FormState, string>>;

const positiveInt = (raw: string): number | undefined => {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

/** Mirrors the backend's validateRule so a bad rule is caught beside its field. */
const validate = (
  type: BookingType,
  form: FormState
): { errors: Errors; payload?: Omit<UpsertPricingRuleRequest, "category"> } => {
  const errors: Errors = {};
  const need = (key: keyof FormState, message: string) => {
    const value = positiveInt(form[key]);
    if (value === undefined) errors[key] = message;
    return value;
  };

  if (type === "hourly") {
    const baseHours = need("baseHours", "Nhập số giờ của gói đầu, ví dụ 3.");
    const basePrice = need("basePrice", "Nhập giá gói đầu, lớn hơn 0.");
    const extra = need("extraHourPrice", "Nhập giá mỗi giờ thêm, lớn hơn 0.");
    return {
      errors,
      payload: Object.keys(errors).length
        ? undefined
        : {
            rule_type: type,
            base_hours: baseHours,
            base_price: basePrice,
            extra_hour_price: extra,
          },
    };
  }

  const flatPrice = need("flatPrice", "Nhập giá, lớn hơn 0.");
  if (type === "overnight") {
    if (!form.windowStart) errors.windowStart = "Chọn giờ bắt đầu nhận khách.";
    if (!form.windowEnd) errors.windowEnd = "Chọn giờ kết thúc nhận khách.";
    if (form.windowStart && form.windowStart === form.windowEnd) {
      errors.windowEnd = "Giờ kết thúc phải khác giờ bắt đầu.";
    }
  }
  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    payload:
      type === "overnight"
        ? {
            rule_type: type,
            flat_price: flatPrice,
            window_start: form.windowStart,
            window_end: form.windowEnd,
          }
        : { rule_type: type, flat_price: flatPrice },
  };
};

type DialogProps = {
  category: HomeCategory;
  type: BookingType;
  /** The active rule being replaced; undefined when none exists yet. */
  current: PricingRuleEntity | undefined;
  onClose: () => void;
};

const RuleFormDialog: FC<DialogProps> = ({
  category,
  type,
  current,
  onClose,
}) => {
  const [form, setForm] = useState<FormState>(() => toForm(current));
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createRule = useCreatePricingRuleMutation();
  const supersedeRule = useSupersedePricingRuleMutation();
  const pending = createRule.isPending || supersedeRule.isPending;

  const meta = RULE_TYPES.find((r) => r.type === type);
  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // A longer stay should never cost more per hour than the opening block, or
  // two short bookings undercut one long one. Warn, don't block: the admin may
  // mean it for a promotion.
  const baseHours = positiveInt(form.baseHours);
  const basePrice = positiveInt(form.basePrice);
  const extraHourPrice = positiveInt(form.extraHourPrice);
  const extraTooHigh =
    type === "hourly" &&
    baseHours !== undefined &&
    basePrice !== undefined &&
    extraHourPrice !== undefined &&
    extraHourPrice * baseHours > basePrice;

  const submit = async () => {
    const result = validate(type, form);
    setErrors(result.errors);
    if (!result.payload) {
      const first = Object.keys(result.errors)[0];
      if (first) document.getElementById(`rule-${first}`)?.focus();
      return;
    }
    setSubmitError(null);
    const payload = { ...result.payload, category };
    try {
      if (current) {
        await supersedeRule.mutateAsync({ id: current.id, payload });
      } else {
        await createRule.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Lưu bảng giá thất bại"
      );
    }
  };

  const moneyInput = (key: keyof FormState, label: string, hint?: string) => (
    <AdminField
      id={`rule-${key}`}
      label={label}
      hint={hint}
      error={errors[key]}
    >
      <div className="relative">
        <input
          id={`rule-${key}`}
          name={key}
          value={form[key]}
          onChange={(e) => set(key, e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          autoComplete="off"
          placeholder="500000…"
          aria-invalid={errors[key] ? true : undefined}
          aria-describedby={
            errors[key]
              ? `rule-${key}-error`
              : hint
                ? `rule-${key}-hint`
                : undefined
          }
          className={`${ADMIN_FIELD} pr-12 tabular-nums`}
        />
        <span
          aria-hidden="true"
          className="text-admin-body pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm"
        >
          VND
        </span>
      </div>
      {form[key] && !errors[key] ? (
        <p className="text-admin-body text-xs tabular-nums">
          = {formatVnd(Number(form[key]))}
        </p>
      ) : null}
    </AdminField>
  );

  return (
    <AdminDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`${current ? "Đổi giá" : "Đặt giá"} ${meta?.label.toLowerCase()} · ${HOME_CATEGORY_LABELS[category]}`}
      description={
        current
          ? "Giá mới áp dụng từ bây giờ. Booking đã tạo giữ nguyên giá cũ."
          : meta?.blurb
      }
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
            disabled={pending}
            className={ADMIN_BTN_PRIMARY}
          >
            {pending ? "Đang lưu…" : "Lưu bảng giá"}
          </button>
        </>
      }
    >
      <div className="grid gap-4">
        <AdminFormError message={submitError} />

        {type === "hourly" ? (
          <>
            <AdminField
              id="rule-baseHours"
              label="Số giờ gói đầu"
              error={errors.baseHours}
            >
              <input
                id="rule-baseHours"
                name="baseHours"
                value={form.baseHours}
                onChange={(e) =>
                  set("baseHours", e.target.value.replace(/\D/g, ""))
                }
                inputMode="numeric"
                autoComplete="off"
                placeholder="3…"
                aria-invalid={errors.baseHours ? true : undefined}
                aria-describedby={
                  errors.baseHours ? "rule-baseHours-error" : undefined
                }
                className={`${ADMIN_FIELD} tabular-nums`}
              />
            </AdminField>
            {moneyInput("basePrice", "Giá gói đầu")}
            {moneyInput(
              "extraHourPrice",
              "Giá mỗi giờ thêm",
              "Giờ lẻ được tính tròn thành 1 giờ."
            )}
            {extraTooHigh ? (
              <p className="border-state-pending-line bg-state-pending text-state-pending-fg rounded-field flex gap-2 border px-3 py-2 text-sm">
                <TriangleAlert
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                Giá mỗi giờ thêm đang cao hơn giá trung bình mỗi giờ của gói
                đầu: khách ở lâu sẽ trả nhiều hơn đặt nhiều gói ngắn.
              </p>
            ) : null}
          </>
        ) : (
          <>
            {moneyInput(
              "flatPrice",
              type === "overnight" ? "Giá mỗi đêm" : "Giá mỗi ngày",
              "Tính theo từng 24 giờ; phần lẻ tính tròn thành 1 đơn vị."
            )}
            {type === "overnight" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField
                  id="rule-windowStart"
                  label="Nhận khách từ"
                  error={errors.windowStart}
                >
                  <input
                    id="rule-windowStart"
                    type="time"
                    name="windowStart"
                    value={form.windowStart}
                    onChange={(e) => set("windowStart", e.target.value)}
                    aria-invalid={errors.windowStart ? true : undefined}
                    className={`${ADMIN_FIELD} tabular-nums`}
                  />
                </AdminField>
                <AdminField
                  id="rule-windowEnd"
                  label="Đến trước"
                  error={errors.windowEnd}
                >
                  <input
                    id="rule-windowEnd"
                    type="time"
                    name="windowEnd"
                    value={form.windowEnd}
                    onChange={(e) => set("windowEnd", e.target.value)}
                    aria-invalid={errors.windowEnd ? true : undefined}
                    className={`${ADMIN_FIELD} tabular-nums`}
                  />
                </AdminField>
              </div>
            ) : null}
          </>
        )}
      </div>
    </AdminDialog>
  );
};

type Editing = {
  category: HomeCategory;
  type: BookingType;
  current: PricingRuleEntity | undefined;
};

const CategoryCard: FC<{
  category: HomeCategory;
  onEdit: (editing: Editing) => void;
}> = ({ category, onEdit }) => {
  const rulesQuery = usePricingRulesQuery(category);

  return (
    <section
      aria-labelledby={`pricing-${category}`}
      className="border-admin-line rounded-card bg-admin-card overflow-hidden border shadow-[0_1px_2px_rgba(23,23,23,0.04)]"
    >
      <h2
        id={`pricing-${category}`}
        className="text-admin-ink bg-admin-page border-admin-line border-b px-4 py-3 text-sm font-semibold"
      >
        Hạng {HOME_CATEGORY_LABELS[category]}
      </h2>

      {rulesQuery.isLoading ? (
        <div className="py-8">
          <LabeledSpinner>Đang tải…</LabeledSpinner>
        </div>
      ) : rulesQuery.error ? (
        <p className="text-danger-fg px-4 py-4 text-sm" aria-live="polite">
          {rulesQuery.error.message}
        </p>
      ) : (
        <ul className="divide-admin-line divide-y">
          {RULE_TYPES.map(({ type, label, blurb }) => {
            const rule = rulesQuery.data?.find((r) => r.rule_type === type);
            return (
              <li
                key={type}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-admin-ink text-sm font-medium">{label}</p>
                  {rule ? (
                    <p className="text-admin-ink mt-0.5 text-sm tabular-nums">
                      {summarize(rule)}
                    </p>
                  ) : (
                    <p className="text-state-pending-fg mt-0.5 text-sm">
                      Chưa có giá, khách không đặt được loại này.
                    </p>
                  )}
                  <p className="text-admin-body mt-0.5 text-xs">{blurb}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onEdit({ category, type, current: rule })}
                  className={rule ? ADMIN_BTN_SECONDARY : ADMIN_BTN_PRIMARY}
                >
                  {rule ? "Đổi giá" : "Đặt giá"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export const AdminPricingPanel: FC = () => {
  const [editing, setEditing] = useState<Editing | null>(null);

  return (
    <div className="grid gap-5">
      <AdminPageHeader title="Bảng giá" />

      <p className="text-admin-body max-w-3xl text-sm">
        Giá áp theo hạng phòng. Đổi giá không sửa giá cũ mà đóng nó lại và mở
        giá mới từ thời điểm lưu, nên booking đã tạo vẫn giữ đúng số tiền khách
        đã được báo.
      </p>

      <div className="grid gap-5 xl:grid-cols-2">
        {(Object.keys(HOME_CATEGORY_LABELS) as HomeCategory[]).map(
          (category) => (
            <CategoryCard
              key={category}
              category={category}
              onEdit={setEditing}
            />
          )
        )}
      </div>

      {editing ? (
        <RuleFormDialog
          key={`${editing.category}-${editing.type}`}
          category={editing.category}
          type={editing.type}
          current={editing.current}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
};
