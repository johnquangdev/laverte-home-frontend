import type { FC } from "react";

import { AdminStubPanel } from "@/components/organisms/admin/admin-stub-panel";

const AdminRoomsPage: FC = () => (
  <AdminStubPanel
    title="Phòng"
    purpose="Danh sách home và nest: bật/tắt, sửa mô tả, gắn Google Calendar."
    endpoints={[
      { method: "GET", path: "/api/v1/admin/homes", exists: true },
      { method: "POST", path: "/api/v1/admin/homes", exists: true },
    ]}
  />
);

export default AdminRoomsPage;
