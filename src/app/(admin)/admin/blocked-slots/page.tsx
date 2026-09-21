import type { FC } from "react";

import { AdminStubPanel } from "@/components/organisms/admin/admin-stub-panel";

const AdminBlockedSlotsPage: FC = () => (
  <AdminStubPanel
    title="Khoá lịch"
    purpose="Chặn khung giờ không cho khách đặt — bảo trì, khách quen giữ chỗ, nghỉ lễ."
    endpoints={[
      { method: "GET", path: "/api/v1/admin/blocked-slots", exists: true },
      { method: "POST", path: "/api/v1/admin/blocked-slots", exists: true },
    ]}
  />
);

export default AdminBlockedSlotsPage;
