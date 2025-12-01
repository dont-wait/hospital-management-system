"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/shared/Button";
import { FormField } from "@/components/shared/FormField";
import { useUserAuthContext } from "@/contexts";
import { AuthService } from "@/services";
import { accountSchema, LoginAccountDto } from "@/schemas";
import { Employee, Patient } from "@/types";
import styles from "@/styles/auth.module.css";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useUserAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginAccountDto>({
    resolver: zodResolver(accountSchema),
  });

  const onSubmit = useCallback(
    async (loginAccountDto: LoginAccountDto) => {
      const user: Patient | Employee | null =
        await AuthService.login(loginAccountDto);
      if (user) {
        setUser(user);
        router.push("/");
      }
    },
    [router, setUser],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["login-form"]}>
      <FormField
        id="citizenID"
        label="Căn cước công dân"
        placeholder="Nhập số căn cước công dân"
        register={register}
        errors={errors}
      />

      <FormField
        id="password"
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        type="password"
        register={register}
        errors={errors}
      />

      <Link href="/forgot-password" className={styles["forgot-password-btn"]}>
        Quên mật khẩu
      </Link>

      <SubmitButton
        isSubmitting={isSubmitting}
        className={styles["submit-btn"]}
        label="Đăng nhập"
        submittingLabel="Đang đăng nhập..."
      />
    </form>
  );
}
