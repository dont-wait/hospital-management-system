'use client'

import { FormField } from "@/components";
import { Calendar } from "@/lib/client/icon-utils";
import scheduleStyles from "@/styles/doctor.module.css";
import { CreateShiftFormData } from "@/schemas/create-shift";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { SelectField } from "./SelectField";

interface Room {
    id: number;
    name: string;
}

interface CreateShiftFormProps {
    register: UseFormRegister<CreateShiftFormData>;
    errors: FieldErrors<CreateShiftFormData>;
    rooms: Room[];
}

const WORK_SHIFTS = [
    { value: "0", label: "Ca sáng (7h - 12h)" },
    { value: "1", label: "Ca chiều (13h - 17h)" },
] as const;

export function CreateShiftForm({ register, errors, rooms }: CreateShiftFormProps) {
    return (
        <>
            <FormField
                id="taskName"
                label="Tên ca làm việc"
                placeholder="Ví dụ: Ca khám Nội khoa..."
                type="text"
                register={register}
                errors={errors}
            />

            <FormField
                id="date"
                label="Ngày làm việc"
                type="date"
                register={register}
                errors={errors}
                icon={<Calendar size={16} />}
                onClick={(e) => e.currentTarget.showPicker()}
            />

            <SelectField
                id="workShift"
                label="Ca làm việc"
                icon="clock"
                register={register}
                errors={errors}
                options={WORK_SHIFTS}
            />

            <SelectField
                id="roomId"
                label="Phòng khám"
                icon="home"
                register={register}
                errors={errors}
                options={rooms.map(room => ({ value: room.id.toString(), label: room.name }))}
                placeholder="Chọn phòng khám"
            />

            <div className={scheduleStyles["form-group-full"]}>
                <FormField
                    id="description"
                    label="Mô tả"
                    placeholder="Nhập mô tả chi tiết về ca làm việc..."
                    type="textarea"
                    register={register}
                    errors={errors}
                    rows={3}
                />
            </div>
        </>
    );
}