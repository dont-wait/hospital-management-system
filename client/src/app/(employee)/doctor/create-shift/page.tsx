'use client';

import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";
import styles from "@/styles/admin.module.css";
import scheduleStyles from "@/styles/doctor.module.css";
import { Calendar, Clock, Save, X } from "@/lib/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShiftSchema, CreateShiftFormData } from "@/schemas/create-shift";
import { toast } from "react-toastify";
import { FormField, Button } from "@/components";

export default function CreateShiftPage() {
    const { user } = useUserAuthContext();
    const hod = user as Employee;
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateShiftFormData>({
        resolver: zodResolver(createShiftSchema),
        defaultValues: {
            shiftName: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            description: "",
            room: "",
        },
    });

    const onSubmit = async (data: CreateShiftFormData) => {
        try {
            console.log("Creating shift:", data);
            // TODO: Call API to create shift
            toast.success("Tạo ca làm việc thành công!");
            reset();
        } catch (error) {
            void error;
            toast.error("Có lỗi xảy ra khi tạo ca làm việc");
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={styles["admin-container"]}>
            <div className={styles["dashboard-header"]}>
                <h1 className={styles["dashboard-title"]}>
                    Tạo Ca Làm Việc
                </h1>
                <p className={styles["dashboard-subtitle"]}>
                    Trưởng khoa: {hod?.specialization || "Đa khoa"}
                </p>
            </div>

            <div className={scheduleStyles["create-shift-container"]}>
                <form onSubmit={handleSubmit(onSubmit)} className={scheduleStyles["shift-form"]}>
                    <div className={scheduleStyles["form-grid"]}>
                        <FormField
                            id="shiftName"
                            label="Tên ca làm việc"
                            placeholder="Ví dụ: Ca sáng, Ca chiều..."
                            type="text"
                            register={register}
                            errors={errors}
                        />

                        <FormField
                            id="room"
                            label="Phòng khám"
                            placeholder="Ví dụ: Phòng khám số 3"
                            type="text"
                            register={register}
                            errors={errors}
                        />

                        <FormField
                            id="startDate"
                            label="Ngày bắt đầu"
                            type="date"
                            register={register}
                            errors={errors}
                            icon={<Calendar size={16} />}
                            onClick={(e) => e.currentTarget.showPicker()}
                        />

                        <FormField
                            id="endDate"
                            label="Ngày kết thúc"
                            type="date"
                            register={register}
                            errors={errors}
                            icon={<Calendar size={16} />}
                            onClick={(e) => e.currentTarget.showPicker()}
                        />

                        <FormField
                            id="startTime"
                            label="Giờ bắt đầu"
                            type="time"
                            register={register}
                            errors={errors}
                            icon={<Clock size={16} />}
                            onClick={(e) => e.currentTarget.showPicker()}
                        />

                        <FormField
                            id="endTime"
                            label="Giờ kết thúc"
                            type="time"
                            register={register}
                            errors={errors}
                            icon={<Clock size={16} />}
                            onClick={(e) => e.currentTarget.showPicker()}
                        />

                        <div className={scheduleStyles["form-group-full"]}>
                            <FormField
                                id="description"
                                label="Mô tả"
                                placeholder="Nhập mô tả chi tiết về ca làm việc..."
                                type="textarea"
                                register={register}
                                errors={errors}
                                rows={4}
                            />
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
                            <Save size={20} />
                            {isSubmitting ? "Đang tạo..." : "Tạo ca làm việc"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
