"use client";

import { useState, useEffect, useMemo } from "react";
import { DateUtils } from "@/lib/client";
import styles from "@/styles/admin.module.css";
import { DoctorSchedule } from "@/types";
import ScheduleContainer from "@/components/employee/schedule/ScheduleContainer";
import ScheduleHeader from "@/components/employee/schedule/ScheduleHeader";
import WeekCalendar from "@/components/employee/schedule/WeekCalendar";
import { EmployeeService } from "@/services";
import { useUserAuthContext } from "@/contexts";

export default function DoctorSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const { user } = useUserAuthContext();
  const isDoctor = user && "employeeId" in user;
  const empId = isDoctor ? user.employeeId : "";

  useEffect(() => {
    async function fetchSchedule() {
      const response = await EmployeeService.getSchedules(empId);
      setSchedules(response.data);
    }

    fetchSchedule();
    return () => {
      setSchedules([]);
    };
  }, [empId]);

  const weekDays = useMemo(
    () => DateUtils.getWeekDays(selectedDate),
    [selectedDate],
  );

  // Lọc ca làm việc theo tuần
  const weekShifts = useMemo(() => {
    const shiftsMap = new Map<string, DoctorSchedule[]>();

    weekDays.forEach((day) => {
      const dayKey = day.toDateString();
      const dayShifts = shedules.filter((shift) => {
        return DateUtils.isSameDate(shift.startTime, day.toString());
      });
      shiftsMap.set(dayKey, dayShifts);
    });

    return shiftsMap;
  }, [weekDays, shedules]);

  // Lọc ca làm việc theo ngày được chọn
  const todayShifts = useMemo(() => {
    return shedules.filter((shift) => {
      return DateUtils.isSameDate(shift.startTime, selectedDate.toString());
    });
  }, [selectedDate, shedules]);

  const changeWeek = (weeks: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + weeks * 7);
    setSelectedDate(newDate);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles["admin-container"]}>
      <ScheduleHeader changeWeek={changeWeek} selectedDate={selectedDate} />
      <WeekCalendar
        weekDays={weekDays}
        weekShifts={weekShifts}
        selectedDate={selectedDate}
        selectDate={selectDate}
      />
      <ScheduleContainer todayShifts={todayShifts} />
    </div>
  );
}
