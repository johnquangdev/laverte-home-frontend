"use client";

import { useState } from "react";
import { Check, Copy, Info } from "lucide-react";
import type { FC, ReactNode } from "react";

import { LabeledSpinner } from "@/components/atoms/spinner";
import { StatusPill } from "@/components/atoms/status-pill";
import { AdminPageHeader } from "@/components/organisms/admin/admin-page-header";
import { useAdminSettingsQuery } from "@/hooks/queries/admin";
import type { AdminSettingsEntity } from "@/types/api/entities";

const Row: FC<{ label: string; hint?: string; children: ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <div className="grid gap-1 px-4 py-3 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-4">
    <div>
      <p className="text-admin-ink text-sm font-medium">{label}</p>
      {hint ? <p className="text-admin-body mt-0.5 text-xs">{hint}</p> : null}
    </div>
    <div className="text-admin-ink min-w-0 text-sm break-words">{children}</div>
  </div>
);

const Section: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <section
    aria-label={title}
    className="border-admin-line rounded-card bg-admin-card overflow-hidden border shadow-[0_1px_2px_rgba(23,23,23,0.04)]"
  >
    <h2 className="text-admin-ink bg-admin-page border-admin-line border-b px-4 py-3 text-sm font-semibold">
      {title}
    </h2>
    <div className="divide-admin-line divide-y">{children}</div>
  </section>
);

const OnOff: FC<{ on: boolean; onLabel?: string; offLabel?: string }> = ({
  on,
  onLabel = "Đã cấu hình",
  offLabel = "Chưa cấu hình",
}) => (
  <StatusPill tone={on ? "paid" : "pending"}>
    {on ? onLabel : offLabel}
  </StatusPill>
);

const ReadOnlyNote: FC = () => (
  <p className="border-admin-line bg-admin-page text-admin-body rounded-field flex gap-2 border px-3 py-2.5 text-sm">
    <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
    <span>
      Cấu hình nằm trong biến môi trường của máy chủ và được kiểm tra một lần
      lúc khởi động, nên màn này chỉ để xem. Muốn đổi, sửa{" "}
      <code translate="no">.env.production</code> của laverte-core rồi deploy
      lại.
    </span>
  </p>
);

const useSettings = (): {
  settings: AdminSettingsEntity | undefined;
  status: ReactNode;
} => {
  const query = useAdminSettingsQuery();
  if (query.isLoading) {
    return {
      settings: undefined,
      status: <LabeledSpinner>Đang tải…</LabeledSpinner>,
    };
  }
  if (query.error) {
    return {
      settings: undefined,
      status: (
        <p className="text-danger-fg text-sm" aria-live="polite">
          {query.error.message}
        </p>
      ),
    };
  }
  return { settings: query.data, status: null };
};

// The backend reports its webhook path; the host is the public API origin the
// payment provider must reach, which only this build's env knows.
const webhookUrl = (path: string): string => {
  const root = process.env.NEXT_PUBLIC_API_ROOT;
  if (!root) return path;
  try {
    return new URL(path, root).toString();
  } catch {
    return path;
  }
};

const CopyValue: FC<{ value: string; label: string }> = ({ value, label }) => {
  const [copied, setCopied] = useState(false);
  return (
    <span className="flex min-w-0 items-center gap-2">
      <code translate="no" className="min-w-0 truncate">
        {value}
      </code>
      <button
        type="button"
        aria-label={`Sao chép ${label}`}
        onClick={() => {
          void navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        className="rounded-field text-admin-body hover:text-admin-ink hover:bg-admin-page focus-visible:ring-admin-accent flex size-11 shrink-0 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {copied ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Copy aria-hidden="true" className="size-4" />
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Đã sao chép" : ""}
      </span>
    </span>
  );
};

export const AdminSepayPanel: FC = () => {
  const { settings, status } = useSettings();
  return (
    <div className="grid gap-5">
      <AdminPageHeader title="Cấu hình SePay" />
      <ReadOnlyNote />
      {status}
      {settings ? (
        <>
          <Section title="Tài khoản nhận tiền">
            <Row label="Ngân hàng">
              <span translate="no">{settings.sepay.bank_code || "—"}</span>
            </Row>
            <Row label="Số tài khoản" hint="In trên mã QR khách quét.">
              <span className="tabular-nums" translate="no">
                {settings.sepay.bank_account || "—"}
              </span>
            </Row>
            <Row
              label="Tiền tố nội dung CK"
              hint="Nội dung chuyển khoản là tiền tố + mã booking, ví dụ LAVERTE42."
            >
              <span translate="no">{settings.sepay.transfer_prefix}</span>
            </Row>
          </Section>

          <Section title="Webhook">
            <Row
              label="URL nhận webhook"
              hint="Dán vào SePay › Cấu hình webhook, chọn xác thực HMAC-SHA256."
            >
              <CopyValue
                value={webhookUrl(settings.sepay.webhook_path)}
                label="URL webhook"
              />
            </Row>
            <Row label="Khoá ký HMAC">
              <OnOff
                on={settings.sepay.webhook_secret_set}
                onLabel="Đã đặt"
                offLabel="Chưa đặt"
              />
            </Row>
          </Section>

          <Section title="Giữ chỗ">
            <Row
              label="Thời gian giữ chỗ"
              hint="Quá thời gian này chưa chuyển khoản thì booking tự hết hạn và nhả phòng."
            >
              <span className="tabular-nums">
                {settings.booking_pending_ttl_minutes} phút
              </span>
            </Row>
          </Section>
        </>
      ) : null}
    </div>
  );
};

export const AdminSettingsPanel: FC = () => {
  const { settings, status } = useSettings();
  return (
    <div className="grid gap-5">
      <AdminPageHeader title="Cài đặt" />
      <ReadOnlyNote />
      {status}
      {settings ? (
        <>
          <Section title="Vận hành">
            <Row
              label="Múi giờ"
              hint="Mọi ngày giờ trong admin và bảng giá qua đêm đọc theo múi này."
            >
              <span translate="no">{settings.app_timezone}</span>
            </Row>
            <Row
              label="Cảnh báo thiếu mã cửa"
              hint="Báo admin nếu booking sắp bắt đầu mà chưa có mã cửa."
            >
              <span className="tabular-nums">
                Trước {settings.checkin_alert_lead_minutes} phút
              </span>
            </Row>
            <Row label="Email nhận cảnh báo">
              {settings.admin_alert_email || (
                <span className="text-admin-body">Chưa đặt</span>
              )}
            </Row>
          </Section>

          <Section title="Tích hợp">
            <Row label="Đăng nhập Google" hint="Cho admin đăng nhập.">
              <OnOff on={settings.integrations.google_login} />
            </Row>
            <Row
              label="Google Calendar"
              hint="Đẩy booking đã xác nhận lên lịch của từng phòng."
            >
              <OnOff on={settings.integrations.google_calendar} />
            </Row>
            <Row
              label="Zalo ZNS"
              hint="Gửi xác nhận đặt phòng và mã cửa cho khách."
            >
              <OnOff on={settings.integrations.zalo_zns} />
            </Row>
            <Row
              label="Email admin"
              hint="Cảnh báo thiếu mã cửa và tiền về không khớp booking."
            >
              <OnOff on={settings.integrations.admin_email} />
            </Row>
          </Section>

          {!settings.integrations.zalo_zns ||
          !settings.integrations.admin_email ? (
            <p className="text-state-pending-fg text-sm">
              Zalo ZNS và email admin chỉ bật khi cả hai cùng được cấu hình:
              thiếu một bên thì toàn bộ thông báo tắt, để không có tình trạng
              khách nhận tin mà admin không.
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
