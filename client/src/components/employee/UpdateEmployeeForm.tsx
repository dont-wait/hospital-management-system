"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import {
  SubmitButton,
  FormField,
  RadioGroupField,
  DateField,
  AvatarField,
} from "@/components";
import { GENDER_OPTIONS } from "@/config";
import { EmployeeUpdateDto, employeeUpdateSchema } from "@/schemas/employee";
import { AuthUserWithoutTokens } from "@/types";
import { EmployeeService } from "@/services/employee.service";
import authStyles from "@/styles/auth.module.css";
import styles from "@/styles/employee-update.module.css";

interface UpdateEmployeeFormProps {
  employee: AuthUserWithoutTokens;
  isAdmin?: boolean;
  onSuccess?: (updatedEmployee: AuthUserWithoutTokens) => void;
  onCancel?: () => void;
}

export function UpdateEmployeeForm({
  employee,
  isAdmin = false,
  onSuccess,
  onCancel,
}: UpdateEmployeeFormProps) {
  const defaultValues = useMemo((): Partial<EmployeeUpdateDto> => {
    const baseValues: Partial<EmployeeUpdateDto> = {
      phoneNumber: employee.employee?.phoneNumber || "",
      avatarUrl: employee.avatarUrl || "",
    };

    if (isAdmin) {
      return {
        ...baseValues,
        firstName: employee.employee?.firstName || "",
        lastName: employee.employee?.lastName || "",
        dateOfBirth: employee.employee?.dateOfBirth || "",
        hireDate: employee.employee?.hireDate || "",
        gender: (employee.employee?.gender as "M" | "F" | "O") || "M",
        specialization: employee.employee?.specialization || "",
        certificateNumber: employee.employee?.certificateNumber || "",
      };
    }

    return baseValues;
  }, [employee, isAdmin]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm<EmployeeUpdateDto>({
    resolver: zodResolver(employeeUpdateSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: EmployeeUpdateDto) => {
    const payload = isAdmin
      ? data
      : {
          phoneNumber: data.phoneNumber,
          avatarUrl: data.avatarUrl || "",
        };

    const response = await EmployeeService.updateEmployee(
      employee.employee?.employeeId || "",
      payload,
    );

    if (onSuccess) {
      onSuccess(response);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={styles["form-container"]}
    >
      <AvatarField
        initialUrl={employee?.avatarUrl}
        onAvatarChange={(url) => {
          setValue("avatarUrl", url);
        }}
      />

      {isAdmin ? (
        <>
          <div className={styles["grid-layout"]}>
            <div className={styles["column"]}>
              <FormField
                id="firstName"
                label="Họ và tên đệm"
                placeholder="Nhập họ và tên đệm"
                errors={errors}
                register={register}
              />

              <FormField
                id="lastName"
                label="Tên"
                placeholder="Nhập tên"
                errors={errors}
                register={register}
              />

              <FormField
                id="phoneNumber"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                errors={errors}
                register={register}
              />
            </div>

            <div className={styles["column"]}>
              <FormField
                id="specialization"
                label="Chuyên khoa"
                placeholder="Nhập chuyên khoa"
                errors={errors}
                register={register}
              />

              <FormField
                id="certificateNumber"
                label="Chứng chỉ hành nghề"
                placeholder="Nhập chứng chỉ hành nghề"
                errors={errors}
                register={register}
              />

              <DateField<EmployeeUpdateDto>
                name="dateOfBirth"
                setValue={setValue}
                errors={errors}
                defaultValue={employee.employee?.dateOfBirth}
              />

              <RadioGroupField
                name="gender"
                control={control}
                errors={errors}
                options={[...GENDER_OPTIONS]}
              />
            </div>
          </div>
        </>
      ) : (
        <div className={styles["employee-limited-layout"]}>
          <FormField
            id="phoneNumber"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            errors={errors}
            register={register}
          />
        </div>
      )}

      <div className={styles["form-actions"]}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles["cancel-button"]}
          >
            Hủy
          </button>
        )}
        <SubmitButton
          isSubmitting={isSubmitting}
          className={authStyles["submit-btn"]}
          label={isAdmin ? "Cập nhật thông tin" : "Lưu thay đổi"}
          submittingLabel="Đang cập nhật..."
        />
      </div>
    </form>
  );
}
