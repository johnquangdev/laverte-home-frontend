import type { FC } from "react";

import { AdminStubPanel } from "@/components/organisms/admin/admin-stub-panel";

const AdminPricingPage: FC = () => (
  <AdminStubPanel
    title="Bảng giá"
    purpose="Giá theo giờ, qua đêm, theo ngày và các rule phụ thu cuối tuần hoặc lễ."
    endpoints={[
      { method: "GET", path: "/api/v1/admin/pricing-rules", exists: true },
      { method: "POST", path: "/api/v1/admin/pricing-rules", exists: true },
    ]}
  />
);

export default AdminPricingPage;
