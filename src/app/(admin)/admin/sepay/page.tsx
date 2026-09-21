import type { FC } from "react";

import { AdminStubPanel } from "@/components/organisms/admin/admin-stub-panel";

const AdminSepayPage: FC = () => (
  <AdminStubPanel
    title="Cấu hình SePay"
    purpose="Bật/tắt cổng, tài khoản nhận, tiền tố nội dung chuyển khoản, webhook, thời gian giữ chỗ."
    endpoints={[
      { method: "GET", path: "/api/v1/admin/settings/payment", exists: false },
      { method: "PUT", path: "/api/v1/admin/settings/payment", exists: false },
    ]}
  />
);

export default AdminSepayPage;
