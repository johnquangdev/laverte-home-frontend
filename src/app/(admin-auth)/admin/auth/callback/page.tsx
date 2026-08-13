import { Suspense } from "react";
import type { FC } from "react";

import { Spinner } from "@/components/atoms/spinner";
import { AdminCallbackHandler } from "@/components/organisms/admin/admin-callback-handler";

const AdminCallbackPage: FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#071612]">
          <Spinner />
        </div>
      }
    >
      <AdminCallbackHandler />
    </Suspense>
  );
};

export default AdminCallbackPage;
