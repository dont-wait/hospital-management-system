"use client";

import { useState, forwardRef, InputHTMLAttributes, MouseEvent } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "@/components";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/client";
import authStyles from "@/styles/auth.module.css";
import inputStyles from "@/styles/input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: "default" | "error";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, variant, ...props }, ref) => {
    const hasError = error || variant === "error";

    return (
      <input
        ref={ref}
        className={cn(
          inputStyles["input"],
          hasError && authStyles["error-form-control"],
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export interface PasswordInputProps<T extends FieldValues> {
  id: Path<T>;
  placeholder: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  className?: string;
}

export function PasswordInput<T extends FieldValues>({
  id,
  placeholder,
  register,
  errors,
  className,
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!errors[id];
  const Icon = showPassword ? Eye : EyeOff;
  const ariaLabel = showPassword ? "Hide password" : "Show password";
  const togglePassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        error={hasError}
        className={className}
        {...register(id)}
      />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className={authStyles["show-password-btn"]}
        onClick={togglePassword}
        aria-label={ariaLabel}
      >
        <Icon className={authStyles["icon"]} />
      </Button>
    </div>
  );
}
