'use client';

import { useState, useMemo } from "react";
import { isSameDate, getWeekDays } from "@/lib/client";
import styles from "@/styles/admin.module.css";
import { WorkShift } from "@/types";
import { ScheduleHeader, WeekCalendar, ScheduleContainer } from "@/components/employee";

export default function DoctorSchedulePage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);

    const allWorkShifts: WorkShift[] = [
        // Tuần 1
        {
            id: 1,
            name: "Ca sáng",
            startTime: "2025-11-16T07:00:00",
            endTime: "2025-11-16T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled",
            attendanceStatus: "not-checked-in"
        },
        {
            id: 2,
            name: "Ca chiều",
            startTime: "2025-11-16T13:00:00",
            endTime: "2025-11-16T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled",
            attendanceStatus: "not-checked-in"
        },
        {
            id: 3,
            name: "Ca sáng",
            startTime: "2025-11-17T07:00:00",
            endTime: "2025-11-17T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 4,
            name: "Ca chiều",
            startTime: "2025-11-17T13:00:00",
            endTime: "2025-11-17T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 5,
            name: "Ca sáng",
            startTime: "2025-11-18T07:00:00",
            endTime: "2025-11-18T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Completed",
            attendanceStatus: "checked-out",
            actualCheckInTime: "07:05"
        },
        {
            id: 6,
            name: "Ca chiều",
            startTime: "2025-11-18T13:00:00",
            endTime: "2025-11-18T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Completed",
            attendanceStatus: "checked-out",
            actualCheckInTime: "13:15"
        },
        // Tuần 2
        {
            id: 7,
            name: "Ca sáng",
            startTime: "2025-11-19T07:00:00",
            endTime: "2025-11-19T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Completed",
            attendanceStatus: "checked-out",
            actualCheckInTime: "07:25"
        },
        {
            id: 8,
            name: "Ca chiều",
            startTime: "2025-11-20T13:00:00",
            endTime: "2025-11-20T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 9,
            name: "Ca sáng",
            startTime: "2025-11-21T07:00:00",
            endTime: "2025-11-21T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 10,
            name: "Ca chiều",
            startTime: "2025-11-21T13:00:00",
            endTime: "2025-11-21T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 11,
            name: "Ca sáng",
            startTime: "2025-11-22T07:00:00",
            endTime: "2025-11-22T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        // Tuần 3
        {
            id: 12,
            name: "Ca chiều",
            startTime: "2025-11-23T13:00:00",
            endTime: "2025-11-23T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 13,
            name: "Ca sáng",
            startTime: "2025-11-24T07:00:00",
            endTime: "2025-11-24T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Canceled"
        },
        {
            id: 14,
            name: "Ca chiều",
            startTime: "2025-11-25T13:00:00",
            endTime: "2025-11-25T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 15,
            name: "Ca sáng",
            startTime: "2025-11-26T07:00:00",
            endTime: "2025-11-26T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 16,
            name: "Ca chiều",
            startTime: "2025-11-26T13:00:00",
            endTime: "2025-11-26T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        // Tuần 4
        {
            id: 17,
            name: "Ca sáng",
            startTime: "2025-11-27T07:00:00",
            endTime: "2025-11-27T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 18,
            name: "Ca chiều",
            startTime: "2025-11-28T13:00:00",
            endTime: "2025-11-28T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 19,
            name: "Ca sáng",
            startTime: "2025-11-29T07:00:00",
            endTime: "2025-11-29T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 20,
            name: "Ca chiều",
            startTime: "2025-11-29T13:00:00",
            endTime: "2025-11-29T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 21,
            name: "Ca sáng",
            startTime: "2025-11-30T07:00:00",
            endTime: "2025-11-30T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        // Thêm tháng 12
        {
            id: 22,
            name: "Ca sáng",
            startTime: "2025-12-01T07:00:00",
            endTime: "2025-12-01T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 23,
            name: "Ca chiều",
            startTime: "2025-12-01T13:00:00",
            endTime: "2025-12-01T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
    ];

    const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

    // Lọc ca làm việc theo tuần
    const weekShifts = useMemo(() => {
        const shiftsMap = new Map<string, WorkShift[]>();
        
        weekDays.forEach(day => {
            const dayKey = day.toDateString();
            const dayShifts = allWorkShifts.filter(shift => {
                const shiftDate = new Date(shift.startTime);
                return isSameDate(shiftDate, day);
            });
            shiftsMap.set(dayKey, dayShifts);
        });
        
        return shiftsMap;
    }, [weekDays]);

    // Lọc ca làm việc theo ngày được chọn
    const todayShifts = useMemo(() => {
        return allWorkShifts.filter(shift => {
            const shiftDate = new Date(shift.startTime);
            return isSameDate(shiftDate, selectedDate);
        });
    }, [selectedDate]);

    const handleCheckIn = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        setCheckInTime(timeString);
        setIsCheckedIn(true);
    };

    const changeWeek = (weeks: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + (weeks * 7));
        setSelectedDate(newDate);
        setIsCheckedIn(false);
        setCheckInTime(null);
    };

    const selectDate = (date: Date) => {
        setSelectedDate(date);
        setIsCheckedIn(false);
        setCheckInTime(null);
    };

    return (
        <div className={styles["admin-container"]}>
            <ScheduleHeader 
                changeWeek={changeWeek}
                isCheckedIn={isCheckedIn}
                checkInTime={checkInTime}
                handleCheckIn={handleCheckIn}
                selectedDate={selectedDate}
            />
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