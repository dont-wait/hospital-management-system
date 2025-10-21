"use client";

import { useCallback } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  Controller,
  Control,
} from "react-hook-form";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Input, PasswordInput, Label } from "@/components";
import authStyles from "@/styles/auth.module.css";

export interface FormFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string | null;
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
      {label && <Label htmlFor={id}>{label}</Label>}
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

export interface OtpInputProps {
  control: Control<{ otp: string }>;
}

export function OtpInput({ control }: OtpInputProps) {
  const validateOtp = useCallback((value: string) => value.length === 6, []);
  return (
    <Controller
      name="otp"
      control={control}
      rules={{ validate: validateOtp }}
      render={({ field, fieldState }) => (
        <>
          <MuiOtpInput
            sx={{ gap: 0.5 }}
            {...field}
            length={6}
            className={authStyles["otp-input-wrap"]}
          />
          {fieldState.error && (
            <Label className={authStyles["error-message"]}>
              {fieldState.error.message || "Mã OTP không hợp lệ!"}
            </Label>
          )}
        </>
      )}
    />
  );
}
