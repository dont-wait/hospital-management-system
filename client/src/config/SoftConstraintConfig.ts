import { SoftConstraint } from "@/types";

export interface SoftConstraintField extends SoftConstraint {
    key: SoftConstraintScheduleKey;
    defaultValue: string | number;
}

export interface SoftConstraintScheduleConfig {
    start_date: string;
    num_days: number;
    max_weekly_hours_per_doctor: number;
    max_days_off_per_doctor: number;
    doctors_per_shift: number;
    shifts_per_day: number;
}

export type SoftConstraintScheduleKey = keyof SoftConstraintScheduleConfig;

export const SoftConstraintConfig: SoftConstraintField[] = [
    {
        key: "start_date",
        title: "Ngày bắt đầu xếp lịch",
        description: "Ngày bắt đầu xếp lịch",
        inputType: "date",
        defaultValue: new Date().toISOString().split("T")[0], 
    },
    {
        key: "num_days",
        title: "Số ngày xếp lịch",
        description: "7 ngày = 1 tuần",
        inputType: "number",
        defaultValue: 7,
    },
    {
        key: "max_weekly_hours_per_doctor",
        title: "Số giờ làm tối đa / tuần",
        description: "Giới hạn giờ làm mỗi bác sĩ trong 1 tuần",
        inputType: "number",
        defaultValue: 48,
    },
    {
        key: "max_days_off_per_doctor",
        title: "Số ngày nghỉ tối đa",
        description: "Số ngày nghỉ tối đa của mỗi bác sĩ",
        inputType: "number",
        defaultValue: 5,
    },
    {
        key: "doctors_per_shift",
        title: "Bác sĩ mỗi ca",
        description: "Số bác sĩ cần có trong một ca trực",
        inputType: "number",
        defaultValue: 5,
    },
    {
        key: "shifts_per_day",
        title: "Số ca mỗi ngày",
        description: "Tổng số ca trực trong ngày",
        inputType: "number",
        defaultValue: 2,
    },
];
