import type { FC, ReactNode } from "react";

// text-base keeps inputs at 16px: anything smaller makes iOS zoom on focus.
export const ADMIN_FIELD =
  "border-admin-field rounded-field text-admin-ink bg-admin-card focus-visible:ring-admin-accent min-h-control-lg w-full min-w-0 border px-3 text-base focus-visible:ring-2 focus-visible:outline-none aria-invalid:border-danger-fg";

const BTN =
  "rounded-field min-h-control-lg focus-visible:ring-admin-accent inline-flex items-center justify-center gap-2 px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export const ADMIN_BTN_PRIMARY = `${BTN} bg-admin-accent text-white hover:bg-admin-accent/90`;

export const ADMIN_BTN_SECONDARY = `${BTN} border-admin-field bg-admin-card text-admin-ink hover:bg-admin-page border`;

export const ADMIN_BTN_DANGER = `${BTN} bg-danger text-white hover:bg-danger/90`;

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

/**
 * Label above the control, hint or error below it. The error text replaces the
 * hint rather than stacking under it, so the form does not jump twice.
 */
export const AdminField: FC<FieldProps> = ({
  id,
  label,
  hint,
  error,
  children,
}) => (
  // min-w-0: a datetime-local input has an intrinsic minimum wider than half a
  // dialog, and a grid cell otherwise grows to fit it. content-start keeps a
  // field whose neighbour has an extra hint line from spreading its rows apart.
  <div className="grid min-w-0 content-start gap-1.5">
    <label htmlFor={id} className="text-admin-ink text-sm font-medium">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="text-danger-fg text-xs">
        {error}
      </p>
    ) : hint ? (
      <p id={`${id}-hint`} className="text-admin-body text-xs">
        {hint}
      </p>
    ) : null}
  </div>
);

/** Server-side failure for the whole form, announced when it appears. */
export const AdminFormError: FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <p
      className="border-state-cancelled-line bg-state-cancelled text-danger-fg rounded-field border px-3 py-2 text-sm"
      role="alert"
    >
      {message}
    </p>
  ) : null;
