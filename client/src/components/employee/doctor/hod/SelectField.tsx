'use client'

import { Label } from "@/components";
import { Clock, Home } from "@/lib/client/icon-utils";
import scheduleStyles from "@/styles/doctor.module.css";
import authStyles from "@/styles/auth.module.css";
import { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps<T extends FieldValues> {
    id: Path<T>;
    label: string;
    icon?: "clock" | "home";
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    options: readonly SelectOption[] | SelectOption[];
    placeholder?: string;
}

const ICONS = {
    clock: Clock,
    home: Home,
};

export function SelectField<T extends FieldValues>({
    id,
    label,
    icon,
    register,
    errors,
    options,
    placeholder,
}: SelectFieldProps<T>) {
    const error = errors[id];
    const IconComponent = icon ? ICONS[icon] : null;

    return (
        <div className={authStyles["form-group"]}>
            <Label htmlFor={id}>
                {IconComponent ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <IconComponent size={16} />
                        {label}
                    </span>
                ) : (
                    label
                )}
            </Label>
            <select
                id={id}
                {...register(id)}
                className={scheduleStyles["form-select"]}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className={authStyles["error-message"]}>
                    {error.message as string}
                </p>
            )}
        </div>
    );
}
