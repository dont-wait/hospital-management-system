"use client";
import scheduleStyles from "@/styles/schedule.module.css";
import { DateUtils } from "@/lib/client";
import { WorkShift } from "@/types";

interface WeekCalendarProps {
  weekDays: Date[];
  weekShifts: Map<string, WorkShift[]>;
  selectedDate: Date;
  selectDate: (date: Date) => void;
}

export function WeekCalendar({
  weekDays,
  weekShifts,
  selectedDate,
  selectDate,
}: WeekCalendarProps) {
  return (
    <div className={scheduleStyles["week-calendar"]}>
      {weekDays.map((day, index) => {
        const isSelected = DateUtils.isSameDate(
          day.toString(),
          selectedDate.toString(),
        );
        const isToday = DateUtils.isSameDate(
          day.toString(),
          new Date().toString(),
        );
        const dayShifts = weekShifts.get(day.toDateString()) || [];

        return (
          <button
            key={index}
            onClick={() => selectDate(day)}
            className={`${scheduleStyles["day-card"]} ${isSelected ? scheduleStyles["day-selected"] : ""} ${isToday ? scheduleStyles["day-today"] : ""}`}
          >
            <div className={scheduleStyles["day-header"]}>
              <span className={scheduleStyles["day-name"]}>
                {DateUtils.getDisplayDateTime(day.toString(), "WeekdayShort")}
              </span>
              <span className={scheduleStyles["day-date"]}>
                {DateUtils.getDisplayDateTime(day.toString(), "DayMonth")}
              </span>
            </div>
            <div className={scheduleStyles["day-shifts"]}>
              {dayShifts.length > 0 ? (
                <span className={scheduleStyles["shift-count"]}>
                  {dayShifts.length} ca
                </span>
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

