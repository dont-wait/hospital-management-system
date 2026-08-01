import { PreviewShiftCode } from "@/types";

export const SHIFT_ORDER: PreviewShiftCode[] = ["morning", "afternoon"];

export const SHIFT_LABELS: Record<PreviewShiftCode, string> = {
  morning: "Sáng",
  afternoon: "Chiều",
};

const VI_LONG_WEEKDAY = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateStrLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatWeekdayLong(dateStr: string): string {
  return VI_LONG_WEEKDAY[parseLocalDate(dateStr).getDay()];
}

export function formatElapsedHhMmSs(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export interface DoctorInfo {
  id: string;
  name: string;
  experiences: number;
  department_id: string;
  specialization: string;
  days_off: string[];
  preferred_extra_days: string[];
  has_valid_license: boolean;
  is_intern: boolean;
}
