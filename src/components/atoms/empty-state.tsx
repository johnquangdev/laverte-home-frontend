import type { LucideIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState: FC<Props> = ({
  icon: Icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
    <span
      aria-hidden="true"
      className="border-admin-line bg-admin-page text-admin-body flex size-11 items-center justify-center rounded-full border"
    >
      <Icon className="size-5" />
    </span>
    <div>
      <p className="text-admin-ink text-sm font-medium">{title}</p>
      {description ? (
        <p className="text-admin-body mx-auto mt-1 max-w-sm text-sm">
          {description}
        </p>
      ) : null}
    </div>
    {action}
  </div>
);
