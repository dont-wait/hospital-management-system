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
import {
  EmployeeUpdateLimitedDto,
  EmployeeUpdateFullDto,
  employeeUpdateLimitedSchema,
  employeeUpdateFullSchema,
} from "@/schemas";
import { AuthUserWithoutTokens } from "@/types";
import { GENDER_OPTIONS } from "@/config";
import { EmployeeService } from "@/services/doctor.service";
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
  const defaultValues = useMemo(() => {
    if (isAdmin) {
      return {
        firstName: employee.employee?.firstName || "",
        lastName: employee.employee?.lastName || "",
        phoneNumber: employee.employee?.phoneNumber || "",
        email: employee.employee?.email || "",
        dateOfBirth: employee.employee?.dateOfBirth || "",
        gender: employee.employee?.gender || "",
        specialization: employee.employee?.specialization || "",
        certificateNumber: employee.employee?.certificateNumber || "",
        avatarUrl: employee.employee?.avatarUrl || "",
      };
    } else {
      return {
        phoneNumber: employee.employee?.phoneNumber || "",
        email: employee.employee?.email || "",
        avatarUrl: employee.avatarUrl || "",
      };
    }
  }, [employee, isAdmin]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm<EmployeeUpdateFullDto | EmployeeUpdateLimitedDto>({
    resolver: zodResolver(
      isAdmin ? employeeUpdateFullSchema : employeeUpdateLimitedSchema
    ),
    defaultValues,
  });

  const handleFormSubmit = async (
    data: EmployeeUpdateFullDto | EmployeeUpdateLimitedDto
  ) => {
    const updatedEmployee = isAdmin
      ? await EmployeeService.updateEmployeeFull(
          employee.employee?.employeeId || "",
          data as EmployeeUpdateFullDto
        )
      : await EmployeeService.updateEmployeeLimited(
          employee.employee?.employeeId || "",
          data as EmployeeUpdateLimitedDto
        );

    if (onSuccess) {
      onSuccess(updatedEmployee);
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
                id="email"
                type="email"
                label="Email"
                placeholder="Nhập email"
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

              <DateField<EmployeeUpdateFullDto>
                name="dateOfBirth"
                // @ts-ignore - Type issue with discriminated union
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
            id="email"
            type="email"
            label="Email"
            placeholder="Nhập email"
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
