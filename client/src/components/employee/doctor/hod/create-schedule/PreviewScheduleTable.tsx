import styles from "@/styles/create-schedule.module.css";
import { PreviewShiftCode } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDayLabel, PREVIEW_SHIFT_LABELS, toDateKey } from "../../../../../lib/client/previewSchedule.utils";

const SHIFT_ORDER: PreviewShiftCode[] = ["morning", "afternoon"];

export interface PreviewRoomSlot {
    dateKey: string;
    shift: PreviewShiftCode;
    roomLabel: string;
    doctorIds: string[];
}

interface PreviewScheduleTableProps {
    visibleWeek: Date[];
    activeWeekIndex: number;
    totalWeeks: number;
    canPrev: boolean;
    canNext: boolean;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    roomSlots: PreviewRoomSlot[];
    doctorNameMap: Map<string, string>;
    selectedSlotKey: string | null;
    onSelectSlot: (slotKey: string) => void;
}

export function PreviewScheduleTable({
    visibleWeek,
    activeWeekIndex,
    totalWeeks,
    canPrev,
    canNext,
    onPrevWeek,
    onNextWeek,
    roomSlots,
    doctorNameMap,
    selectedSlotKey,
    onSelectSlot,
}: PreviewScheduleTableProps) {
    const normalizedWeek = Array.from({ length: 7 }, (_, index) => visibleWeek[index] ?? null);

    return (
        <>
            <div className={styles["preview-week-nav"]}>
                <button
                    type="button"
                    className={styles["preview-week-btn"]}
                    disabled={!canPrev}
                    onClick={onPrevWeek}
                >
                    <ChevronLeft size={16} /> Tuần trước
                </button>
                <span className={styles["preview-week-label"]}>
                    Tuần {activeWeekIndex + 1}/{Math.max(totalWeeks, 1)}
                </span>
                <button
                    type="button"
                    className={styles["preview-week-btn"]}
                    disabled={!canNext}
                    onClick={onNextWeek}
                >
                    Tuần sau <ChevronRight size={16} />
                </button>
            </div>

            <div className={styles["preview-table-wrapper"]}>
                <table className={styles["preview-table"]}>
                    <thead>
                        <tr>
                            <th className={styles["preview-shift-col"]}>Ca trực</th>
                            {normalizedWeek.map((date, index) => {
                                const dateKey = date ? toDateKey(date) : `empty_${index}`;
                                return (
                                    <th key={dateKey}>
                                        {date ? (
                                            <>
                                                <div className={styles["preview-day-header"]}>{formatDayLabel(date)}</div>
                                                <div className={styles["preview-day-subheader"]}>{dateKey}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={styles["preview-day-header"]}></div>
                                                <div className={styles["preview-day-subheader"]}></div>
                                            </>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {SHIFT_ORDER.map((shift) => (
                            <tr
                                key={shift}
                                className={`${styles["preview-shift-row"]} ${styles[`preview-shift-row-${shift}`]}`}
                            >
                                <td
                                    className={`${styles["preview-shift-label-cell"]} ${styles[`preview-shift-label-cell-${shift}`]}`}
                                >
                                    {PREVIEW_SHIFT_LABELS[shift]}
                                </td>
                                {normalizedWeek.map((date, index) => {
                                    if (!date) {
                                        return (
                                            <td
                                                key={`${shift}_empty_${index}`}
                                                className={`${styles["preview-slot-cell"]} ${styles[`preview-slot-cell-${shift}`]}`}
                                            >
                                                <span className={styles["preview-shift-empty"]}></span>
                                            </td>
                                        );
                                    }

                                    const dateKey = toDateKey(date);
                                    const slots = roomSlots
                                        .filter((slot) => slot.shift === shift && slot.dateKey === dateKey)
                                        .sort((a, b) => a.roomLabel.localeCompare(b.roomLabel));

                                    return (
                                        <td
                                            key={`${shift}_${dateKey}`}
                                            className={`${styles["preview-slot-cell"]} ${styles[`preview-slot-cell-${shift}`]}`}
                                        >
                                            {slots.length === 0 ? (
                                                <span className={styles["preview-shift-empty"]}></span>
                                            ) : (
                                                <div className={styles["preview-slot-stack"]}>
                                                    {slots.map((slot) => {
                                                        const slotKey = `${slot.dateKey}_${slot.shift}_${slot.roomLabel}`;
                                                        const description = slot.doctorIds
                                                            .map((doctorId) => doctorNameMap.get(doctorId) || `BS ${doctorId.slice(0, 8)}`)
                                                            .join(", ");

                                                        return (
                                                            <button
                                                                key={slotKey}
                                                                type="button"
                                                                onClick={() => onSelectSlot(slotKey)}
                                                                className={`${styles["preview-slot-card"]} ${selectedSlotKey === slotKey ? styles["preview-slot-card-active"] : ""}`}
                                                            >
                                                                <div className={styles["preview-slot-title"]}>
                                                                    {`${PREVIEW_SHIFT_LABELS[slot.shift]} ${slot.roomLabel} - ${slot.doctorIds.length} bác sĩ`}
                                                                </div>
                                                                <div className={styles["preview-slot-description"]}>{description}</div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
