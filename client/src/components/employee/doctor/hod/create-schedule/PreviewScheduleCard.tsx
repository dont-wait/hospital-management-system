'use client';

import { PreviewScheduleHeader } from "@/components/employee/doctor/hod/create-schedule/PreviewScheduleHeader";
import { PreviewScheduleTable } from "@/components/employee/doctor/hod/create-schedule/PreviewScheduleTable";
import { useUserAuthContext } from "@/contexts/UserAuthContext";
import { EmployeeService } from "@/services/employee.service";
import styles from "@/styles/create-schedule.module.css";
import {
    AuthUserWithoutTokens,
    Employee,
    PreviewScheduleResponse,
    PreviewShiftCode,
} from "@/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { buildAutoAssignments, chunkDays } from "../../../../../lib/client/previewSchedule.utils";

const PREVIEW_RESPONSE_MOCK: PreviewScheduleResponse = {
    status: "queued",
    progress_percent: 100,
    result: {
        selected_option_id: "opt-01",
        selected_schedule: {
            start_date: "2026-03-09",
            num_days: 30,
            required_doctors_per_shift: 1,
            shifts_per_day: 2,
            assignments: [],
        },
    },
};

export function PreviewScheduleCard({ doctors }: { doctors: AuthUserWithoutTokens[] }) {
    const [activeWeekIndex, setActiveWeekIndex] = useState<number>(0);
    const previewResponse = PREVIEW_RESPONSE_MOCK;
    const selectedSchedule = previewResponse.result.selected_schedule;

    const allDays = useMemo(() => {
        const startDate = new Date(selectedSchedule.start_date);
        const totalDays = Math.max(selectedSchedule.num_days, 1);

        return Array.from({ length: totalDays }, (_, idx) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + idx);
            return date;
        });
    }, [selectedSchedule.num_days, selectedSchedule.start_date]);

    const weeks = useMemo(() => chunkDays(allDays, 7), [allDays]);

    useEffect(() => {
        if (activeWeekIndex > Math.max(weeks.length - 1, 0)) {
            setActiveWeekIndex(0);
        }
    }, [activeWeekIndex, weeks.length]);

    const visibleWeek = weeks[activeWeekIndex] ?? [];

    const assignments = useMemo(() => {
        return selectedSchedule.assignments.length > 0
            ? selectedSchedule.assignments
            : buildAutoAssignments(doctors, allDays);
    }, [allDays, doctors, selectedSchedule.assignments]);

    const assignmentMap = useMemo(() => {
        const map = new Map<string, Set<PreviewShiftCode>>();

        assignments.forEach((item) => {
            const shiftCode = item.shift.toLowerCase();
            if (shiftCode !== "morning" && shiftCode !== "afternoon") return;

            const normalizedShift = shiftCode as PreviewShiftCode;

            item.doctor_ids.forEach((doctorId) => {
                const key = `${doctorId}_${item.date}`;
                const prev = map.get(key) ?? new Set<PreviewShiftCode>();
                prev.add(normalizedShift);
                map.set(key, prev);
            });
        });

        return map;
    }, [assignments]);

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

    return (
        <div className={`${styles["schedule-container"]} ${styles["preview-schedule-container"]}`}>
            <PreviewScheduleHeader
                activeWeekIndex={activeWeekIndex}
                weekRangeLabel={weekRangeLabel}
            />

            <PreviewScheduleTable
                doctors={doctors}
                visibleWeek={visibleWeek}
                activeWeekIndex={activeWeekIndex}
                totalWeeks={weeks.length}
                canPrev={canPrev}
                canNext={canNext}
                onPrevWeek={() => canPrev && setActiveWeekIndex((prev) => prev - 1)}
                onNextWeek={() => canNext && setActiveWeekIndex((prev) => prev + 1)}
                assignmentMap={assignmentMap}
            />
        </div>
    );
}