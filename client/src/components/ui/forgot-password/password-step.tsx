import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { newPasswordSchema, NewPasswordDto } from "@/schemas/auth";

interface PasswordStepProps {
  newPassword: string;
  loading: boolean;
  onSubmit: (newPasswordDto: NewPasswordDto) => Promise<void>;
}

export function PasswordStep({
  newPassword,
  loading,
  onSubmit,
}: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordDto>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword,
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            {...register("newPassword")}
            className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-600">{errors.newPassword.message}</p>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>Mật khẩu phải:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Có ít nhất 8 ký tự</li>
            <li>Chứa chữ hoa và chữ thường</li>
            <li>Chứa ít nhất 1 số và ký tự đặc biệt</li>
          </ul>
        </div>

        <Button type="submit" className="w-full h-12" disabled={loading}>
          {loading ? (
            <LoadingSpinner text="Đang cập nhật..." />
          ) : (
            "Đặt lại mật khẩu"
          )}
        </Button>
      </form>
    </>
  );
}
