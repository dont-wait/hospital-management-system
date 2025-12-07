'use client'

import { Employee, AuthUserWithoutTokens, Room } from "@/types";
import scheduleStyles from "@/styles/doctor.module.css";
import { X } from "@/lib/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShiftSchema, CreateShiftFormData, CreateShiftPayload } from "@/schemas/create-shift";
import { toast } from "react-toastify";
import { Button } from "@/components/shared/Button";
import { useState, useEffect, useCallback } from "react";
import { ScheduleService, EmployeeService } from "@/services";
import { DoctorCheckBox } from "./DoctorCheckBox";
import { CreateShiftForm } from "./CreateShiftForm";
import { DepartmentService } from "@/services/department.service";

interface CreateShiftFormContainerProps {
    hod: Employee;
}

export default function CreateShiftFormContainer({ hod }: CreateShiftFormContainerProps) {
    const [doctors, setDoctors] = useState<AuthUserWithoutTokens[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
    
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateShiftFormData>({
        resolver: zodResolver(createShiftSchema),
        defaultValues: {
            taskName: "",
            date: "",
            workShift: "0",
            description: "",
            roomId: "",
            selectedDoctors: [],
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeesData = await EmployeeService.getAllEmployees(
                    "doctor",
                    hod.departmentId,
                );
                setDoctors(employeesData);

                const roomsData = await DepartmentService.getRoomsByDepartmentId(hod.departmentId);
                setRooms(roomsData);
            } catch (error) {
                void error;
                toast.error("Không thể tải dữ liệu");
            }
        };

        fetchData();
    }, [hod?.departmentId]);

    const handleDoctorToggle = useCallback((doctorId: string) => {
        setSelectedDoctors(prev => {
            const newSelection = prev.includes(doctorId)
                ? prev.filter(id => id !== doctorId)
                : [...prev, doctorId];
            setValue("selectedDoctors", newSelection, { shouldValidate: true });
            return newSelection;
        });
    }, [setValue]);

    const onSubmit = async (data: CreateShiftFormData) => {
        try {       
            const payload: CreateShiftPayload = {
                taskName: data.taskName,
                date: data.date,
                workShift: parseInt(data.workShift),
                description: data.description || "",
                departmentId: hod.departmentId,
                roomId: parseInt(data.roomId),
                taskRegistrations: data.selectedDoctors.map(id => ({ employeeId: id })),
            };

            await ScheduleService.createShift(payload);
            
            reset();
            setSelectedDoctors([]);
        } catch (error) {
            void error;
            toast.error("Tạo ca làm việc thất bại. Vui lòng thử lại.");
        }
    };

    const handleReset = useCallback(() => {
        reset();
        setSelectedDoctors([]);
    }, [reset]);

    return (
        <div className={scheduleStyles["create-shift-container"]}>
            <form onSubmit={handleSubmit(onSubmit)} className={scheduleStyles["shift-form"]}>
                <div className={scheduleStyles["form-grid"]}>
                    <CreateShiftForm 
                        rooms={rooms}
                        register={register}
                        errors={errors}
                    />

                    <DoctorCheckBox 
                        doctors={doctors}
                        errors={errors}
                        selectedDoctors={selectedDoctors}
                        onDoctorToggle={handleDoctorToggle}
                    />
                </div>

                <div className={scheduleStyles["form-actions"]}>
                    <Button
                        type="button"
                        onClick={handleReset}
                        variant="secondary"
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                        Xóa
                    </Button>
                    <Button
                        type="submit"
                        variant="default"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang tạo..." : "Tạo ca làm việc"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
