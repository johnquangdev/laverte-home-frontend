import type { FC } from "react";

import { AdminStubPanel } from "@/components/organisms/admin/admin-stub-panel";

const AdminSettingsPage: FC = () => (
  <AdminStubPanel
    title="Cài đặt"
    purpose="Thông tin chỗ nghỉ, múi giờ, mẫu tin nhắn Zalo, email nhận cảnh báo."
    endpoints={[
      { method: "GET", path: "/api/v1/admin/settings", exists: false },
      { method: "PUT", path: "/api/v1/admin/settings", exists: false },
    ]}
  />
);

export default AdminSettingsPage;
