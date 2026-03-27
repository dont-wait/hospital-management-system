import { AuthUserWithoutTokens, PreviewShiftAssignment, PreviewShiftCode } from "@/types";

export const PREVIEW_SHIFT_LABELS: Record<PreviewShiftCode, string> = {
    morning: "Sáng",
    afternoon: "Chiều",
};

const VI_SHORT_WEEKDAY = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];


export function toDateKey(date: Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(4, "0");

    return `${day}/${month}/${year}`;
}

export function normalizeDateKey(dateKey: string) {
    if (!dateKey) return "";

    if (dateKey.includes("-")) {
        const [year, month, day] = dateKey.split("-");
        if (!year || !month || !day) return dateKey;

        const normalizedYear = year.length === 2
            ? `20${year}`
            : year.padStart(4, "0");

        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${normalizedYear}`;
    }

    if (dateKey.includes("/")) {
        const [day, month, year] = dateKey.split("/");
        if (!day || !month || !year) return dateKey;

        const normalizedYear = year.length === 2
            ? `20${year}`
            : year.padStart(4, "0");

        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${normalizedYear}`;
    }

    return dateKey;
}

export function parseDateKeyToDate(dateKey: string) {
    const normalized = normalizeDateKey(dateKey);
    const [day, month, year] = normalized.split("/");
    if (!day || !month || !year) return null;

    const fullYear = year.length === 2 ? Number(year) + 2000 : Number(year);
    const monthIndex = Number(month) - 1;
    const dayNumber = Number(day);

    const parsed = new Date(fullYear, monthIndex, dayNumber);
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed;
}

export function compareDateKeys(a: string, b: string) {
    const dateA = parseDateKeyToDate(a);
    const dateB = parseDateKeyToDate(b);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateA.getTime() - dateB.getTime();
}

export function formatDayLabel(date: Date) {
    const day = VI_SHORT_WEEKDAY[date.getDay()];
    
    return `${day}`;
}

export function chunkDays(days: Date[], size: number) {
    const chunks: Date[][] = [];

    for (let i = 0; i < days.length; i += size) {
        chunks.push(days.slice(i, i + size));
    }

    return chunks;
}

export function buildAutoAssignments(doctors: AuthUserWithoutTokens[], days: Date[]): PreviewShiftAssignment[] {
    if (doctors.length === 0) return [];

    const items: PreviewShiftAssignment[] = [];

    days.forEach((date, dayIndex) => {
        const doctor = doctors[dayIndex % doctors.length];
        const doctorId = doctor.employee?.employeeId;

        if (!doctorId) return;

        // Mock fallback: a doctor can be assigned for both morning and afternoon in the same day.
        items.push({
            date: toDateKey(date),
            shift: "morning",
            doctor_ids: [doctorId],
        });

        items.push({
            date: toDateKey(date),
            shift: "afternoon",
            doctor_ids: [doctorId],
        });
    });

    return items;
}
