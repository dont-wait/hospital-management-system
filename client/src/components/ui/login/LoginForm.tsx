"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/login/PasswordInput";
import { UsernameInput } from "@/components/ui/login/UsernameInput";
import { accountSchema } from "@/schemas/auth";
import type { LoginPatientDto } from "@/types/index";

interface LoginFormProps {
  onSubmit: (patientDto: LoginPatientDto) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPatientDto>({
    resolver: zodResolver(accountSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="citizenID">Căn cước công dân</Label>
        <UsernameInput
          id="citizenID"
          placeholder="Nhập số căn cước công dân"
          {...register("citizenID")}
          className={errors.citizenID ? "border-red-500" : ""}
        />
        {errors.citizenID && (
          <p className="text-sm text-red-600">{errors.citizenID.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <PasswordInput
          id="password"
          placeholder="Nhập mật khẩu"
          {...register("password")}
          error={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
