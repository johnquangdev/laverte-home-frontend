import dayjs from "dayjs";

/**
 * `<input type="datetime-local">` carries no zone. Admins work in the business
 * zone, so the browser's offset is the one to attach before the value leaves.
 */
export const localInputToIso = (value: string): string => dayjs(value).format();

export const isoToLocalInput = (iso: string): string =>
  dayjs(iso).format("YYYY-MM-DDTHH:mm");
