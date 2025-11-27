'use client';

import { useUserAuthContext } from "@/contexts";
import { Employee, AuthUserWithoutTokens } from "@/types";
import styles from "@/styles/admin.module.css";
import scheduleStyles from "@/styles/doctor.module.css";
import { Calendar, X, Users, Clock, Home } from "@/lib/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShiftSchema, CreateShiftFormData, CreateShiftPayload } from "@/schemas/create-shift";
import { toast } from "react-toastify";
import { FormField, Button, Label } from "@/components";
import { useState, useEffect } from "react";
import { ScheduleService, EmployeeService } from "@/services";
import authStyles from "@/styles/auth.module.css";

export default function CreateShiftPage() {
    const { user } = useUserAuthContext();
    const hod = user as Employee;
    
    const [doctors, setDoctors] = useState<AuthUserWithoutTokens[]>([]);
    const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
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

                // TODO: Fetch rooms theo departmentId
                setRooms([
                    { id: 1, name: "Phòng 1" },
                    { id: 2, name: "Phòng 2" },
                    { id: 3, name: "Phòng 3" },
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Không thể tải dữ liệu");
            }
        };

        if (hod?.departmentId) {
            console.log("ffffff")
            fetchData();
        }
    }, [hod?.departmentId]);

    const handleDoctorToggle = (doctorId: string) => {
        setSelectedDoctors(prev => {
            const newSelection = prev.includes(doctorId)
                ? prev.filter(id => id !== doctorId)
                : [...prev, doctorId];
            setValue("selectedDoctors", newSelection);
            return newSelection;
        });
    };

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
            const errorMessage = "Có lỗi xảy ra khi tạo ca làm việc";
            toast.error(errorMessage);
        }
    };

    const handleReset = () => {
        reset();
        setSelectedDoctors([]);
    };

    return (
        <div className={styles["admin-container"]}>
            <div className={styles["dashboard-header"]}>
                <h1 className={styles["dashboard-title"]}>
                    Tạo Ca Làm Việc
                </h1>
                <p className={styles["dashboard-subtitle"]}>
                    Khoa: {hod?.departmentName || "Đa khoa"}
                </p>
            </div>

            <div className={scheduleStyles["create-shift-container"]}>
                <form onSubmit={handleSubmit(onSubmit)} className={scheduleStyles["shift-form"]}>
                    <div className={scheduleStyles["form-grid"]}>
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

                        <div className={authStyles["form-group"]}>
                            <Label htmlFor="workShift">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Clock size={16} />
                                    Ca làm việc
                                </span>
                            </Label>
                            <select
                                id="workShift"
                                {...register("workShift")}
                                className={scheduleStyles["form-select"]}
                            >
                                <option value="0">Ca sáng (7h - 12h)</option>
                                <option value="1">Ca chiều (13h - 17h)</option>
                            </select>
                            {errors.workShift && (
                                <p className={authStyles["error-message"]}>
                                    {errors.workShift.message}
                                </p>
                            )}
                        </div>

                        <div className={authStyles["form-group"]}>
                            <Label htmlFor="roomId">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Home size={16} />
                                    Phòng khám
                                </span>
                            </Label>
                            <select
                                id="roomId"
                                {...register("roomId")}
                                className={scheduleStyles["form-select"]}
                            >
                                <option value="">Chọn phòng khám</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                            {errors.roomId && (
                                <p className={authStyles["error-message"]}>
                                    {errors.roomId.message}
                                </p>
                            )}
                        </div>

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

                        <div className={authStyles["form-group"]} style={{ gridColumn: "1 / -1" }}>
                            <Label>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Users size={16} />
                                    Chọn bác sĩ
                                </span>
                            </Label>
                            <div className={scheduleStyles["doctors-grid"]}>
                                {doctors.map(doc => (
                                    <label
                                        key={doc.employee?.employeeId}
                                        className={scheduleStyles["doctor-card"]}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDoctors.includes(doc.employee?.employeeId || "")}
                                            onChange={() => handleDoctorToggle(doc.employee?.employeeId || "")}
                                            className={scheduleStyles["doctor-checkbox"]}
                                        />
                                        <div className={scheduleStyles["doctor-info"]}>
                                            <span className={scheduleStyles["doctor-name"]}>
                                                {doc.employee?.firstName} {doc.employee?.lastName}
                                            </span>
                                            {doc.employee?.specialization && (
                                                <span className={scheduleStyles["doctor-specialization"]}>
                                                    {doc.employee.specialization}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.selectedDoctors && (
                                <p className={authStyles["error-message"]}>
                                    {errors.selectedDoctors.message}
                                </p>
                            )}
                        </div>
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
        </div>
    );
}
