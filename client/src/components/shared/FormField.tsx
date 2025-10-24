import { useState, useEffect, useCallback } from "react";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  Controller,
  Control,
  UseFormSetValue,
  PathValue,
} from "react-hook-form";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { MuiOtpInput } from "mui-one-time-password-input";
import {
  Input,
  PasswordInput,
  Label,
  DayInput,
  MonthSelect,
  YearInput,
  AvatarUpload,
  Textarea,
} from "@/components";
import { PatientUpdateDto } from "@/schemas";
import { parseDateString, formatDateString, validateDay } from "@/lib/client";
import authStyles from "@/styles/auth.module.css";
import inputStyles from "@/styles/input.module.css";

export interface FormFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string | null;
  placeholder: string;
  type?: "text" | "email" | "password" | "textarea";
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  className?: string;
  rows?: number;
}
export function FormField<T extends FieldValues>({
  id,
  label,
  placeholder,
  type = "text",
  register,
  errors,
  rows = 4,
}: FormFieldProps<T>) {
  const error = errors[id];
  const errorMessage = error?.message as string | "lỗi";

  const renderInput = () => {
    switch (type) {
      case "password":
        return (
          <PasswordInput
            id={id}
            placeholder={placeholder}
            register={register}
            errors={errors}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={id}
            placeholder={placeholder}
            rows={rows}
            error={!!error}
            {...register(id)}
          />
        );

      default:
        return (
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            error={!!error}
            {...register(id)}
          />
        );
    }
  };

  return (
    <div className={authStyles["form-group"]}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {renderInput()}
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

interface AddressFieldProps {
  setValue: UseFormSetValue<PatientUpdateDto>;
  errors: FieldErrors<PatientUpdateDto>;
  control: Control<PatientUpdateDto>;
  patient: Partial<PatientUpdateDto>;
}

export function AddressField({
  setValue,
  errors,
  control,
  patient,
}: AddressFieldProps) {
  const [nationality, setNationality] = useState(
    patient.nationality || "Vietnam",
  );

  const handleNationalityChange = useCallback(
    (newNationality: string, onChange: (value: string) => void) => {
      setNationality(newNationality);
      onChange(newNationality);
      setValue("placeOfResidence", "");
    },
    [setValue],
  );

  return (
    <>
      <div className={authStyles["form-group"]}>
        <Label htmlFor="nationality">Quốc tịch</Label>
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <CountryDropdown
              value={field.value || ""}
              onChange={(val) => {
                handleNationalityChange(val, field.onChange);
              }}
              className={inputStyles["input"]}
            />
          )}
        />
        {errors.nationality && (
          <Label className={authStyles["error-message"]}>
            {errors.nationality.message || "Quốc tịch không được để trống!"}
          </Label>
        )}
      </div>

      <div className={authStyles["form-group"]}>
        <Label htmlFor="placeOfResidence">Nơi sinh</Label>
        <Controller
          name="placeOfResidence"
          control={control}
          render={({ field }) => (
            <RegionDropdown
              key={nationality}
              country={nationality}
              value={field.value || ""}
              onChange={field.onChange}
              className={inputStyles["input"]}
              blankOptionLabel="-- Chọn nơi sinh --"
              defaultOptionLabel="-- Chọn nơi sinh --"
            />
          )}
        />
        {errors.placeOfResidence && (
          <Label className={authStyles["error-message"]}>
            {errors.placeOfResidence.message || "Nơi sinh không được để trống!"}
          </Label>
        )}
      </div>
    </>
  );
}
type Option = {
  value: string;
  label: string;
};

type RadioGroupFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  options: Option[];
  wrapperClassName?: string;
  itemClassName?: string;
  errorClassName?: string;
};

export function RadioGroupField<T extends FieldValues>({
  name,
  control,
  errors,
  options,
  wrapperClassName,
  itemClassName,
  errorClassName,
}: RadioGroupFieldProps<T>) {
  const error = errors[name];

  return (
    <div className={authStyles["form-control"]}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={wrapperClassName || inputStyles["gender-input-wrap"]}>
            {options.map(({ value, label }) => (
              <div
                key={value}
                className={itemClassName || inputStyles["gender-input"]}
              >
                <Input
                  type="radio"
                  value={value}
                  checked={field.value === value}
                  onChange={field.onChange}
                />
                <Label>{label}</Label>
              </div>
            ))}
          </div>
        )}
      />
      {error && (
        <Label className={errorClassName || authStyles["error-message"]}>
          {error.message as string}
        </Label>
      )}
    </div>
  );
}

type DateFieldProps<T extends FieldValues> = {
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  defaultValue?: string;
  label?: string;
};

export function DateField<T extends FieldValues>({
  name,
  setValue,
  errors,
  defaultValue,
  label = "Ngày sinh",
}: DateFieldProps<T>) {
  const [dayError, setDayError] = useState<string | null>(null);
  const [dateState, setDateState] = useState(() => {
    return (
      (defaultValue && parseDateString(defaultValue)) || {
        day: "",
        month: "",
        year: "",
      }
    );
  });

  useEffect(() => {
    const error = validateDay(dateState.day, dateState.month, dateState.year);
    setDayError(error);
  }, [dateState.day, dateState.month, dateState.year]);

  useEffect(() => {
    const { day, month, year } = dateState;
    if (day && month && year && !dayError) {
      const dateString = formatDateString(day, month, year);
      setValue(name, dateString as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    } else {
      setValue(name, "" as PathValue<T, Path<T>>, { shouldValidate: false });
    }
  }, [dateState, dayError, setValue, name]);

  const handleDayChange = (value: string) => {
    setDateState((prev) => ({ ...prev, day: value }));
  };

  const handleMonthChange = (value: string) => {
    setDateState((prev) => ({ ...prev, month: value }));
  };

  const handleYearChange = (value: string) => {
    setDateState((prev) => ({ ...prev, year: value }));
  };

  const getFieldError = (
    errors: FieldErrors<T>,
    fieldName: string,
  ): FieldError | undefined => {
    const keys = fieldName.split(".");
    return keys.reduce<FieldError | FieldErrors<T> | undefined>((obj, key) => {
      if (obj && typeof obj === "object" && key in obj) {
        return obj[key as keyof typeof obj] as
          | FieldError
          | FieldErrors<T>
          | undefined;
      }
      return undefined;
    }, errors) as FieldError | undefined;
  };

  const fieldError = getFieldError(errors, name);

  return (
    <div className={authStyles["form-group"]}>
      <Label>{label}</Label>
      <div className={inputStyles["date-input"]}>
        <DayInput value={dateState.day} onChange={handleDayChange} />
        <MonthSelect value={dateState.month} onChange={handleMonthChange} />
        <YearInput value={dateState.year} onChange={handleYearChange} />
      </div>
      {dayError && (
        <Label className={authStyles["error-message"]}>{dayError}</Label>
      )}
      {fieldError && !dayError && (
        <Label className={authStyles["error-message"]}>
          {fieldError.message}
        </Label>
      )}
    </div>
  );
}

type AvatarFieldProps = {
  initialUrl?: string;
  onAvatarChange: (url: string) => void;
  size?: number;
  buttonText?: string;
  showPreview?: boolean;
};

export function AvatarField({
  initialUrl,
  onAvatarChange,
  size = 96,
  buttonText = "Thay đổi ảnh",
  showPreview = true,
}: AvatarFieldProps) {
  return (
    <AvatarUpload
      initialUrl={initialUrl}
      onAvatarChange={onAvatarChange}
      size={size}
      buttonText={buttonText}
      showPreview={showPreview}
    />
  );
}
