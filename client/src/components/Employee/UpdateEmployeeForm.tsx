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
import { DoctorService } from "@/services/doctor.service";
import authStyles from "@/styles/auth.module.css";
import patientStyles from "@/styles/patient.module.css";

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
        is_Active: employee.is_Active ?? true,
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
      ? await DoctorService.updateEmployeeFull(
          employee.employee?.employeeId || "",
          data as EmployeeUpdateFullDto
        )
      : await DoctorService.updateEmployeeLimited(
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
      className="space-y-6"
    >
      <AvatarField
        initialUrl={employee?.avatarUrl}
        onAvatarChange={(url) => {
          setValue("avatarUrl", url);
        }}
      />

      {isAdmin ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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

            <div className="space-y-4">
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

              {/* Trạng thái hoạt động */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("is_Active")}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Kích hoạt tài khoản
                  </span>
                </label>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-md mx-auto space-y-4">
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

      <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
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
