'use client';

import { useState } from "react";
import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";
import styles from "@/styles/admin.module.css";
import scheduleStyles from "@/styles/doctor.module.css";
import { Calendar, Clock, Save, X } from "@/lib/client";

export default function CreateShiftPage() {
    const { user } = useUserAuthContext();
    const hod = user as Employee;
    
    const [formData, setFormData] = useState({
        shiftName: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        description: "",
        room: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Creating shift:", formData);
    };

    const handleReset = () => {
        setFormData({
            shiftName: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            description: "",
            room: "",
        });
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
                <form onSubmit={handleSubmit} className={scheduleStyles["shift-form"]}>
                    <div className={scheduleStyles["form-grid"]}>
                        <div className={scheduleStyles["form-group"]}>
                            <label htmlFor="shiftName" className={scheduleStyles["form-label"]}>
                                Tên ca làm việc <span className={scheduleStyles["required"]}>*</span>
                            </label>
                            <input
                                type="text"
                                id="shiftName"
                                name="shiftName"
                                value={formData.shiftName}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Ca sáng, Ca chiều..."
                                className={scheduleStyles["form-input"]}
                                required
                            />
                        </div>

                        <div className={scheduleStyles["form-group"]}>
                            <label htmlFor="room" className={scheduleStyles["form-label"]}>
                                Phòng khám <span className={scheduleStyles["required"]}>*</span>
                            </label>
                            <input
                                type="text"
                                id="room"
                                name="room"
                                value={formData.room}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Phòng khám số 3"
                                className={scheduleStyles["form-input"]}
                                required
                            />
                        </div>

                        <div className={scheduleStyles["form-group"]}>
                            <label className={scheduleStyles["form-label"]}>
                                <Calendar size={16} />
                                Ngày bắt đầu <span className={scheduleStyles["required"]}>*</span>
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                onClick={(e) => e.currentTarget.showPicker()}
                                className={scheduleStyles["form-input"]}
                                required
                            />
                        </div>

                        <div className={scheduleStyles["form-group"]}>
                            <label className={scheduleStyles["form-label"]}>
                                <Calendar size={16} />
                                Ngày kết thúc <span className={scheduleStyles["required"]}>*</span>
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                onClick={(e) => e.currentTarget.showPicker()}
                                className={scheduleStyles["form-input"]}
                                required
                            />
                        </div>

                        <div className={scheduleStyles["form-group"]}>
                            <label className={scheduleStyles["form-label"]}>
                                <Clock size={16} />
                                Giờ bắt đầu <span className={scheduleStyles["required"]}>*</span>
                            </label>
                            <input
                                type="time"
                                id="startTime"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                onClick={(e) => e.currentTarget.showPicker()}
                                className={scheduleStyles["form-input"]}
                                required
                            />
                        </div>

                        <div className={scheduleStyles["form-group"]}>
                            <label className={scheduleStyles["form-label"]}>
                                <Clock size={16} />
                                Giờ kết thúc <span className={scheduleStyles["required"]}>*</span>
                            </label>
                            <input
                                type="time"
                                id="endTime"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                onClick={(e) => e.currentTarget.showPicker()}
                                className={scheduleStyles["form-input"]}
                                required
                            />
                        </div>

                        <div className={scheduleStyles["form-group-full"]}>
                            <label htmlFor="description" className={scheduleStyles["form-label"]}>
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Nhập mô tả chi tiết về ca làm việc..."
                                className={scheduleStyles["form-textarea"]}
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className={scheduleStyles["form-actions"]}>
                        <button
                            type="button"
                            onClick={handleReset}
                            className={scheduleStyles["btn-reset"]}
                        >
                            <X size={20} />
                            Xóa
                        </button>
                        <button
                            type="submit"
                            className={scheduleStyles["btn-submit"]}
                        >
                            <Save size={20} />
                            Tạo ca làm việc
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
