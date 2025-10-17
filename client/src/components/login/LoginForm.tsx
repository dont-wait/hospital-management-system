import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import { Label } from "@/components/shared/Label";
import { PasswordInput } from "@/components/login/PasswordInput";
import { UsernameInput } from "@/components/login/UsernameInput";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { accountSchema, LoginAccountDto } from "@/schemas/auth";

interface LoginFormProps {
  onSubmit: (patientDto: LoginAccountDto) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginAccountDto>({
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

      <div>
        <Link
          href="/forgot-password"
          className="flex justify-end text-sm text-blue-600 "
        >
          Quên mật khẩu
        </Link>
      </div>

      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? <LoadingSpinner text="Đang đăng nhập..." /> : "Đăng nhập"}
      </Button>
    </form>
  );
}
