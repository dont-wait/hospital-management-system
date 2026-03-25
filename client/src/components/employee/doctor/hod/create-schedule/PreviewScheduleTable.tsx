import styles from "@/styles/create-schedule.module.css";
import { AuthUserWithoutTokens, PreviewShiftCode } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDayLabel, PREVIEW_SHIFT_LABELS, toDateKey } from "../../../../../lib/client/previewSchedule.utils";

const SHIFT_ORDER: PreviewShiftCode[] = ["morning", "afternoon"];

interface PreviewScheduleTableProps {
    doctors: AuthUserWithoutTokens[];
    visibleWeek: Date[];
    activeWeekIndex: number;
    totalWeeks: number;
    canPrev: boolean;
    canNext: boolean;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    assignmentMap: Map<string, Set<PreviewShiftCode>>;
}

export function PreviewScheduleTable({
    doctors,
    visibleWeek,
    activeWeekIndex,
    totalWeeks,
    canPrev,
    canNext,
    onPrevWeek,
    onNextWeek,
    assignmentMap,
}: PreviewScheduleTableProps) {
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
                            <th className={styles["preview-doctor-col"]}>Bác sĩ</th>
                            {visibleWeek.map((date) => (
                                <th key={toDateKey(date)}>{formatDayLabel(date)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.length === 0 ? (
                            <tr>
                                <td colSpan={visibleWeek.length + 1} className={styles["preview-empty-row"]}>
                                    Chưa có dữ liệu bác sĩ trong khoa.
                                </td>
                            </tr>
                        ) : (
                            doctors.map((doctor) => {
                                const employee = doctor.employee;
                                if (!employee) return null;

                                return (
                                    <tr key={employee.employeeId}>
                                        <td className={styles["preview-doctor-cell"]}>
                                            <div className={styles["preview-doctor-name"]}>
                                                BS. {employee.firstName} {employee.lastName}
                                            </div>
                                        </td>

                                        {visibleWeek.map((date) => {
                                            const dateKey = toDateKey(date);
                                            const shifts = assignmentMap.get(`${employee.employeeId}_${dateKey}`);

                                            return (
                                                <td key={`${employee.employeeId}_${dateKey}`}>
                                                    {shifts && shifts.size > 0 ? (
                                                        <div className={styles["preview-shift-stack"]}>
                                                            {SHIFT_ORDER.filter((shift) => shifts.has(shift)).map((shift) => (
                                                                <span
                                                                    key={`${employee.employeeId}_${dateKey}_${shift}`}
                                                                    className={`${styles["preview-shift-chip"]} ${styles[`preview-shift-${shift}`]}`}
                                                                >
                                                                    {PREVIEW_SHIFT_LABELS[shift]}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className={styles["preview-shift-empty"]}>--</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
