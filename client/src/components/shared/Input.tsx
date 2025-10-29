import {
  useState,
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  MouseEvent,
} from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components";
import { months } from "@/config";
import { cn } from "@/lib/client";
import authStyles from "@/styles/auth.module.css";
import inputStyles from "@/styles/input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: "default" | "error";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, variant, ...props }, ref) => {
    const hasError = error ?? variant === "error";

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

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  variant?: "default" | "error";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, variant, ...props }, ref) => {
    const hasError = error ?? variant === "error";
    return (
      <textarea
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
Textarea.displayName = "Textarea";

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

type DayInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

export const DayInput = ({ value, onChange }: DayInputProps) => (
  <Input
    placeholder="Ngày"
    value={value}
    onChange={(e) => {
      onChange(e.target.value);
    }}
  />
);

type MonthSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export const MonthSelect = ({ value, onChange }: MonthSelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={inputStyles["input"]}
  >
    <option value="">Tháng</option>
    {months.map((m) => (
      <option key={m.value} value={m.value}>
        {m.label}
      </option>
    ))}
  </select>
);

type YearInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const YearInput = ({ value, onChange }: YearInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d{1,4}$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <Input
      type="number"
      placeholder="Năm"
      value={value}
      onChange={handleChange}
      min="1900"
      max="2100"
    />
  );
};
