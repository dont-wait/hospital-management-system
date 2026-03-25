import { AuthUserWithoutTokens, PreviewShiftAssignment, PreviewShiftCode } from "@/types";

export const PREVIEW_SHIFT_LABELS: Record<PreviewShiftCode, string> = {
    am: "Sáng",
    pm: "Chiều",
};

const VI_SHORT_WEEKDAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function toShiftCode(rawShift: string): PreviewShiftCode | null {
    const normalized = rawShift.trim().toLowerCase();

    if (["morning", "sang", "sáng", "1", "am"].includes(normalized)) return "am";
    if (["afternoon", "chieu", "chiều", "2", "pm"].includes(normalized)) return "pm";

    return null;
}

export function toDateKey(date: Date) {
    return date.toISOString().split("T")[0];
}

export function formatDayLabel(date: Date) {
    const day = VI_SHORT_WEEKDAY[date.getDay()];
    const dayOfMonth = date.getDate().toString().padStart(2, "0");
    return `${day} (${dayOfMonth})`;
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
