export type TimeUnit = "seconds" | "milliseconds";

export interface UnixToDateResult {
  ok: boolean;
  date?: Date;
  error?: string;
}

export function unixToDate(value: string, unit: TimeUnit): UnixToDateResult {
  const trimmed = value.trim();
  if (trimmed === "") return { ok: false, error: "Enter a Unix timestamp." };

  const num = Number(trimmed);
  if (Number.isNaN(num)) return { ok: false, error: "Not a valid number." };

  const ms = unit === "seconds" ? num * 1000 : num;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return { ok: false, error: "Timestamp is out of range." };
  return { ok: true, date };
}

export interface DateToUnixResult {
  ok: boolean;
  seconds?: number;
  milliseconds?: number;
  error?: string;
}

/** `dateInput` is the value of an `<input type="datetime-local">` — no
 * timezone suffix, so `Date` parses it as local wall-clock time. */
export function dateToUnix(dateInput: string): DateToUnixResult {
  if (!dateInput) return { ok: false, error: "Pick a date and time." };
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return { ok: false, error: "Invalid date." };
  return { ok: true, seconds: Math.floor(date.getTime() / 1000), milliseconds: date.getTime() };
}

export function formatUtc(date: Date): string {
  return date.toUTCString();
}

export function formatLocal(date: Date): string {
  return date.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" });
}

export function formatIso(date: Date): string {
  return date.toISOString();
}

/** Value suitable for an `<input type="datetime-local">`, in local time. */
export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
