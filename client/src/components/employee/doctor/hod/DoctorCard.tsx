'use client'

import scheduleStyles from "@/styles/doctor.module.css";
import { AuthUserWithoutTokens } from "@/types";
import { memo } from "react";

interface DoctorCardProps {
    doctor: AuthUserWithoutTokens;
    isSelected: boolean;
    onToggle: () => void;
}

export const DoctorCard = memo(function DoctorCard({ 
    doctor, 
    isSelected, 
    onToggle 
}: DoctorCardProps) {
    const { employee } = doctor;
    
    if (!employee) return null;

    return (
        <label className={scheduleStyles["doctor-card"]}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggle}
                className={scheduleStyles["doctor-checkbox"]}
            />
            <div className={scheduleStyles["doctor-info"]}>
                <span className={scheduleStyles["doctor-name"]}>
                    {employee.firstName} {employee.lastName}
                </span>
                {employee.specialization && (
                    <span className={scheduleStyles["doctor-specialization"]}>
                        {employee.specialization}
                    </span>
                )}
            </div>
        </label>
    );
});
