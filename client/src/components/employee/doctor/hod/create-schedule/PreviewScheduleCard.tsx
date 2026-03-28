'use client';

import { PreviewScheduleHeader } from "@/components/employee/doctor/hod/create-schedule/PreviewScheduleHeader";
import {
    PreviewRoomSlot,
    PreviewScheduleTable,
} from "@/components/employee/doctor/hod/create-schedule/PreviewScheduleTable";
import styles from "@/styles/create-schedule.module.css";
import {
    AuthUserWithoutTokens,
    Employee,
    PreviewShiftAssignment,
    PreviewScheduleResult,
    PreviewShiftCode,
} from "@/types";
import { useEffect, useMemo, useState } from "react";
import {
    buildAutoAssignments,
    chunkDays,
    compareDateKeys,
    normalizeDateKey,
    parseDateKeyToDate,
    PREVIEW_SHIFT_LABELS,
    toDateKey,
} from "../../../../../lib/client/previewSchedule.utils";

interface PreviewScheduleCardProps {
    doctors: AuthUserWithoutTokens[];
    scheduleResult: PreviewScheduleResult | null;
    isPollingProgress: boolean;
    progressPercent: number;
}

export function PreviewScheduleCard({
    doctors,
    scheduleResult,
    isPollingProgress,
    progressPercent,
}: PreviewScheduleCardProps) {
    const [activeWeekIndex, setActiveWeekIndex] = useState<number>(0);
    const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);

    const selectedSchedule = scheduleResult?.selected;
    const doctorMap = useMemo(() => {
        const map = new Map<string, Employee>();
        doctors.forEach((doctor) => {
            if (doctor.employee?.employeeId) {
                map.set(doctor.employee.employeeId, doctor.employee);
            }
        });

        return map;
    }, [doctors]);

    const doctorNameMap = useMemo(() => {
        const map = new Map<string, string>();
        doctorMap.forEach((employee, employeeId) => {
            map.set(employeeId, `BS ${employee.firstName} ${employee.lastName}`);
        });

        return map;
    }, [doctorMap]);

    const scheduleDays = useMemo(() => {
        if (!selectedSchedule) return [];

        const startDate = new Date(selectedSchedule.start_date);
        const totalDays = Math.max(selectedSchedule.num_days, 1);

        return Array.from({ length: totalDays }, (_, idx) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + idx);
            return date;
        });
    }, [selectedSchedule]);

    const displayDays = useMemo(() => {
        if (scheduleDays.length === 0) return [];

        const firstScheduleDate = scheduleDays[0];
        const mondayOffset = (firstScheduleDate.getDay() + 6) % 7;
        const calendarStart = new Date(firstScheduleDate);
        calendarStart.setDate(firstScheduleDate.getDate() - mondayOffset);

        const totalCells = Math.ceil((mondayOffset + scheduleDays.length) / 7) * 7;

        return Array.from({ length: totalCells }, (_, idx) => {
            const date = new Date(calendarStart);
            date.setDate(calendarStart.getDate() + idx);
            return date;
        });
    }, [scheduleDays]);

    const weeks = useMemo(() => chunkDays(displayDays, 7), [displayDays]);

    useEffect(() => {
        if (activeWeekIndex > Math.max(weeks.length - 1, 0)) {
            setActiveWeekIndex(0);
        }
    }, [activeWeekIndex, weeks.length]);

    const visibleWeek = weeks[activeWeekIndex] ?? [];

    const assignments = useMemo(() => {
        if (!selectedSchedule) return [];

        return selectedSchedule.assignments.length > 0
            ? selectedSchedule.assignments
            : buildAutoAssignments(doctors, scheduleDays);
    }, [doctors, scheduleDays, selectedSchedule]);

    const roomSlots = useMemo<PreviewRoomSlot[]>(() => {
        const groupedSlots = new Map<string, Set<string>>();

        assignments.forEach((item) => {
            const assignment = item as PreviewShiftAssignment & { room?: string };
            const shiftCode = assignment.shift.toLowerCase();
            if (shiftCode !== "morning" && shiftCode !== "afternoon") return;

            const normalizedShift = shiftCode as PreviewShiftCode;
            const normalizedDateKey = normalizeDateKey(assignment.date);
            const roomLabel = assignment.room && assignment.room.trim().length > 0
                ? assignment.room.trim()
                : "P-01";
            const slotKey = `${normalizedDateKey}_${normalizedShift}_${roomLabel}`;

            const doctorIds = groupedSlots.get(slotKey) ?? new Set<string>();
            assignment.doctor_ids.forEach((doctorId) => doctorIds.add(doctorId));
            groupedSlots.set(slotKey, doctorIds);
        });

        return Array.from(groupedSlots.entries())
            .map(([slotKey, doctorIds]) => {
                const [dateKey, shift, roomLabel] = slotKey.split("_");
                return {
                    dateKey,
                    shift: shift as PreviewShiftCode,
                    roomLabel,
                    doctorIds: Array.from(doctorIds),
                };
            })
            .sort((a, b) => {
                if (a.dateKey !== b.dateKey) return compareDateKeys(a.dateKey, b.dateKey);
                if (a.shift !== b.shift) return a.shift.localeCompare(b.shift);
                return a.roomLabel.localeCompare(b.roomLabel);
            });
    }, [assignments]);

    useEffect(() => {
        if (roomSlots.length === 0) {
            setSelectedSlotKey(null);
            return;
        }

        if (selectedSlotKey && roomSlots.some((slot) => `${slot.dateKey}_${slot.shift}_${slot.roomLabel}` === selectedSlotKey)) {
            return;
        }

        const firstVisibleDate = visibleWeek[0] ? toDateKey(visibleWeek[0]) : null;
        const firstVisibleSlot = firstVisibleDate
            ? roomSlots.find((slot) => compareDateKeys(slot.dateKey, firstVisibleDate) >= 0)
            : roomSlots[0];

        const fallback = firstVisibleSlot ?? roomSlots[0];
        setSelectedSlotKey(`${fallback.dateKey}_${fallback.shift}_${fallback.roomLabel}`);
    }, [roomSlots, selectedSlotKey, visibleWeek]);

    const selectedSlot = useMemo(() => {
        if (!selectedSlotKey) return null;
        return roomSlots.find((slot) => `${slot.dateKey}_${slot.shift}_${slot.roomLabel}` === selectedSlotKey) ?? null;
    }, [roomSlots, selectedSlotKey]);

    const selectedDoctors = useMemo(() => {
        if (!selectedSlot) return [];

        return selectedSlot.doctorIds.map((doctorId) => {
            const employee = doctorMap.get(doctorId);

            return {
                doctorId,
                employee,
                displayName: employee
                    ? `Bác sĩ ${employee.firstName} ${employee.lastName}`
                    : `Bác sĩ ${doctorId.slice(0, 8)}`,
            };
        });
    }, [doctorMap, selectedSlot]);

    const selectedSlotTitle = useMemo(() => {
        if (!selectedSlot) return "";

        const date = parseDateKeyToDate(selectedSlot.dateKey);
        if (!date) return `Ca trực ${PREVIEW_SHIFT_LABELS[selectedSlot.shift]} (${selectedSlot.dateKey})`;

        const weekday = new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(date);
        const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

        return `Ca trực ${PREVIEW_SHIFT_LABELS[selectedSlot.shift]} - ${capitalizedWeekday} (${selectedSlot.dateKey})`;
    }, [selectedSlot]);

    const weekRangeLabel = useMemo(() => {
        if (visibleWeek.length === 0) return "";

        const first = visibleWeek[0];
        const last = visibleWeek[visibleWeek.length - 1];
        const firstText = `${first.getDate().toString().padStart(2, "0")}/${(first.getMonth() + 1).toString().padStart(2, "0")}`;
        const lastText = `${last.getDate().toString().padStart(2, "0")}/${(last.getMonth() + 1).toString().padStart(2, "0")}`;
        return `${firstText} - ${lastText}`;
    }, [visibleWeek]);

    const canPrev = activeWeekIndex > 0;
    const canNext = activeWeekIndex < weeks.length - 1;
    const hasPreviewData = Boolean(selectedSchedule);

    return (
        <div className={`${styles["schedule-container"]} ${styles["preview-schedule-container"]}`}>
            <PreviewScheduleHeader
                activeWeekIndex={activeWeekIndex}
                weekRangeLabel={weekRangeLabel}
            />
            {!hasPreviewData ? (
                <div className={styles["preview-table-wrapper"]}>
                    <div className={styles["preview-empty-row"]}>
                        {isPollingProgress
                            ? `Hệ thống đang tạo lịch tự động, vui lòng chờ... (${progressPercent}%)`
                            : "Chưa có dữ liệu lịch. Hãy nhấn Tạo lịch để bắt đầu."}
                    </div>
                </div>
            ) : (
                <>
                    <PreviewScheduleTable
                        visibleWeek={visibleWeek}
                        activeWeekIndex={activeWeekIndex}
                        totalWeeks={weeks.length}
                        canPrev={canPrev}
                        canNext={canNext}
                        onPrevWeek={() => canPrev && setActiveWeekIndex((prev) => prev - 1)}
                        onNextWeek={() => canNext && setActiveWeekIndex((prev) => prev + 1)}
                        roomSlots={roomSlots}
                        doctorNameMap={doctorNameMap}
                        selectedSlotKey={selectedSlotKey}
                        onSelectSlot={setSelectedSlotKey}
                    />

                    {selectedSlot && (
                        <div className={styles["preview-slot-detail"]}>
                            <div className={styles["preview-slot-detail-header"]}>
                                <div>
                                    <p className={styles["preview-slot-detail-title"]}>{selectedSlotTitle}</p>
                                    <p className={styles["preview-slot-detail-subtitle"]}>{selectedDoctors.length} bác sĩ tham gia</p>
                                </div>
                            </div>

                            <div className={styles["preview-slot-doctor-grid"]}>
                                {selectedDoctors.map(({ doctorId, employee, displayName }) => {
                                    const isIntern = (employee?.experienceYears ?? 0) < 5;

                                    return (
                                        <article key={`${selectedSlotKey}_${doctorId}`} className={styles["preview-slot-doctor-card"]}>
                                            <div className={styles["preview-slot-doctor-row"]}>
                                                <h4 className={styles["preview-slot-doctor-name"]}>{displayName}</h4>
                                                <span className={`${styles["preview-slot-role-badge"]} ${isIntern ? styles["preview-slot-role-intern"] : styles["preview-slot-role-official"]}`}>
                                                    {isIntern ? "Bác sĩ thực tập" : "Bác sĩ chính thức"}
                                                </span>
                                            </div>
                                            <p className={styles["preview-slot-doctor-code"]}>DOC-{doctorId.slice(0, 4).toUpperCase()}</p>
                                            <p className={styles["preview-slot-doctor-meta"]}>Kinh nghiệm: {employee?.experienceYears ?? 0} năm</p>
                                            <p className={styles["preview-slot-doctor-meta"]}>Khoa: {employee?.departmentName ?? "Không rõ"}</p>
                                            <p className={styles["preview-slot-doctor-meta"]}>Chuyên khoa: {employee?.specialization ?? "Không rõ"}</p>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}