'use client'

import scheduleStyles from "@/styles/doctor.module.css";
import authStyles from "@/styles/auth.module.css";
import { Label } from "@/components";
import { Users } from "@/lib/client/icon-utils";
import { AuthUserWithoutTokens } from "@/types";
import { FieldErrors } from "react-hook-form";
import { CreateShiftFormData } from "@/schemas/create-shift";
import { DoctorCard } from "./DoctorCard";

interface DoctorCheckBoxProps {
    doctors: AuthUserWithoutTokens[];
    errors: FieldErrors<CreateShiftFormData>;
    selectedDoctors: string[];
    onDoctorToggle: (doctorId: string) => void;
}

export function DoctorCheckBox({ 
    doctors, 
    errors, 
    selectedDoctors, 
    onDoctorToggle 
}: DoctorCheckBoxProps) {
    return (
        <div className={authStyles["form-group"]} style={{ gridColumn: "1 / -1" }}>
            <Label>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    <Users size={16} />
                    Chọn bác sĩ ({selectedDoctors.length}/{doctors.length})
                </span>
            </Label>
            <div className={scheduleStyles["doctors-grid"]}>
                {doctors.map(doc => (
                    <DoctorCard
                        key={doc.employee?.employeeId}
                        doctor={doc}
                        isSelected={selectedDoctors.includes(doc.employee?.employeeId || "")}
                        onToggle={() => onDoctorToggle(doc.employee?.employeeId || "")}
                    />
                ))}
            </div>
            {errors.selectedDoctors && (
                <p className={authStyles["error-message"]}>
                    {errors.selectedDoctors.message}
                </p>
            )}
        </div>
    );
}