export type Point = [x: number, y: number];

/**
 * Cardinal spline through every point, emitted as cubic béziers. Straight
 * polylines read as jagged at these sizes; the curve is what makes a trend
 * legible rather than decorative, so tension stays low enough not to overshoot
 * a local extreme.
 */
export const smoothPath = (pts: Point[], tension = 0.5): string => {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0][0]},${pts[0][1]}`;

  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const k = (tension * 2) / 6;
    d += ` C ${p1[0] + (p2[0] - p0[0]) * k},${p1[1] + (p2[1] - p0[1]) * k} ${
      p2[0] - (p3[0] - p1[0]) * k
    },${p2[1] - (p3[1] - p1[1]) * k} ${p2[0]},${p2[1]}`;
  }
  return d;
};

/** Money on axis ticks and stat tiles, where the full figure will not fit. */
export const compactVnd = (value: number): string => {
  if (value >= 1_000_000_000)
    return `${(value / 1_000_000_000).toFixed(1).replace(".", ",")} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(Math.round(value));
};

export const percentChange = (
  current: number,
  previous: number
): number | undefined =>
  previous > 0
    ? Number((((current - previous) / previous) * 100).toFixed(1))
    : undefined;
