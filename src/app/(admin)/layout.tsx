import type { FC, ReactNode } from "react";

import { AdminLayoutShell } from "@/components/organisms/admin/admin-layout-shell";

type Props = {
  children: ReactNode;
};

const AdminLayout: FC<Props> = ({ children }) => {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
};

export default AdminLayout;
