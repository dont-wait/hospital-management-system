"use client";

import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Input, PasswordInput, Label } from "@/components";
import authStyles from "@/styles/auth.module.css";

export interface FormFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  className?: string;
}

export function FormField<T extends FieldValues>({
  id,
  label,
  placeholder,
  type = "text",
  register,
  errors,
}: FormFieldProps<T>) {
  const error = errors[id];
  const errorMessage = error?.message as string | "lỗi";

  return (
    <div className={authStyles["form-group"]}>
      <Label htmlFor={id}>{label}</Label>
      {type === "password" ? (
        <PasswordInput
          id={id}
          placeholder={placeholder}
          register={register}
          errors={errors}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          error={!!error}
          {...register(id)}
        />
      )}
      {errorMessage && (
        <p className={authStyles["error-message"]}>{errorMessage}</p>
      )}
    </div>
  );
}
