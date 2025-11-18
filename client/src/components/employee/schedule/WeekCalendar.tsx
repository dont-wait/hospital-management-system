'use client'
import scheduleStyles from "@/styles/schedule.module.css";
import { isSameDate, getDayName, getDayMonth } from "@/lib/client";
import { WorkShift } from "@/types";

interface WeekCalendarProps {
    weekDays: Date[];
    weekShifts: Map<string, WorkShift[]>;
    selectedDate: Date;
    selectDate: (date: Date) => void;
}

export function WeekCalendar({ weekDays, weekShifts, selectedDate, selectDate }: WeekCalendarProps) {
    return (
        <div className={scheduleStyles["week-calendar"]}>
            {weekDays.map((day, index) => {
                const isSelected = isSameDate(day, selectedDate);
                const isToday = isSameDate(day, new Date());
                const dayShifts = weekShifts.get(day.toDateString()) || [];
                
                return (
                    <button
                        key={index}
                        onClick={() => selectDate(day)}
                        className={`${scheduleStyles["day-card"]} ${isSelected ? scheduleStyles["day-selected"] : ""} ${isToday ? scheduleStyles["day-today"] : ""}`}
                    >
                        <div className={scheduleStyles["day-header"]}>
                            <span className={scheduleStyles["day-name"]}>{getDayName(day)}</span>
                            <span className={scheduleStyles["day-date"]}>{getDayMonth(day)}</span>
                        </div>
                        <div className={scheduleStyles["day-shifts"]}>
                            {dayShifts.length > 0 ? (
                                <span className={scheduleStyles["shift-count"]}>{dayShifts.length} ca</span>
                            ) : (
                                <span className={scheduleStyles["no-shift"]}>Nghỉ</span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}