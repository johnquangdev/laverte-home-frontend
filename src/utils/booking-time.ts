// No imports on purpose: `npm test` loads this file straight into Node.

const HOUR = 36e5;

export const durationLabel = (start: Date, end: Date): string => {
  const hours = Math.round((end.getTime() - start.getTime()) / HOUR);
  if (hours <= 0) return "—";
  return hours % 24 === 0 ? `${hours / 24} ngày` : `${hours} giờ`;
};

export const holdSecondsLeft = (
  expiresAt: string | null,
  nowMs: number
): number | null => {
  if (!expiresAt) return null;
  return Math.max(0, Math.round((Date.parse(expiresAt) - nowMs) / 1000));
};

export const formatHold = (seconds: number): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
};
