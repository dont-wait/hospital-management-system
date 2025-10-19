"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { FormField, Button, LoadingSpinner } from "@/components";
import { patientSchema, RegisterPatientDto } from "@/schemas";
import { AuthService } from "@/services";
import styles from "@/styles/auth.module.css";

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPatientDto>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = useCallback(
    async (registerPatientDto: RegisterPatientDto) => {
      const isRegistered = await AuthService.register(registerPatientDto);
      if (isRegistered) router.push("/login");
    },
    [router],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["register-form"]}>
      <div className={styles["register-groups"]}>
        <FormField
          label="Căn cước công dân"
          id="citizenID"
          placeholder="Nhập số căn cước công dân"
          errors={errors}
          register={register}
        />

        <FormField
          label="Email"
          id="email"
          type="email"
          placeholder="Nhập email của bạn"
          errors={errors}
          register={register}
        />

        <FormField
          label="Tên"
          id="lastName"
          placeholder="Nhập tên của bạn"
          errors={errors}
          register={register}
        />

        <FormField
          label="Họ và tên đệm"
          id="firstName"
          placeholder="Nhập họ và tên đệm của bạn"
          errors={errors}
          register={register}
        />

        <FormField
          label="Mật khẩu"
          id="password"
          type="password"
          placeholder="Nhập mật khẩu"
          errors={errors}
          register={register}
        />

        <FormField
          label="Mật khẩu xác thực"
          id="confirmPassword"
          type="password"
          placeholder="Nhập mật khẩu xác thực"
          errors={errors}
          register={register}
        />
      </div>

      {/* Contact Number */}
      <FormField
        label="Số điện thoại"
        id="phoneNumber"
        placeholder=""
        errors={errors}
        register={register}
      />

      <Button
        type="submit"
        className={styles["submit-btn"]}
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoadingSpinner text="Đang đăng ký..." /> : "Đăng ký"}
      </Button>
    </form>
  );
}
