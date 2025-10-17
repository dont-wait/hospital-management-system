import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Label } from "@/components/shared/Label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { patientSchema, RegisterPatientDto } from "@/schemas/auth";
import { Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  onSubmit: (patientDto: RegisterPatientDto) => Promise<void>;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPatientDto>({
    resolver: zodResolver(patientSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. CitizenID */}
        <div className="space-y-2">
          <Label htmlFor="citizenID">Căn cước công dân</Label>
          <Input
            id="citizenID"
            placeholder="Nhập số căn cước công dân"
            {...register("citizenID")}
            className={errors.citizenID ? "border-red-500" : ""}
          />
          {errors.citizenID && (
            <p className="text-sm text-red-600">{errors.citizenID.message}</p>
          )}
        </div>

        {/* 2. Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Nhập email của bạn"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* 3. LastName*/}
        <div className="space-y-2">
          <Label htmlFor="lastName">Tên</Label>
          <Input
            id="lastName"
            placeholder="Nhập tên của bạn"
            {...register("lastName")}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        {/* 4. FirstName */}
        <div className="space-y-2">
          <Label htmlFor="firstName">Họ và tên đệm</Label>
          <Input
            id="firstName"
            placeholder="Nhập họ và tên đệm của bạn"
            {...register("firstName")}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* 5. Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              {...register("password")}
              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* 6. ConfirmPassword */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="cofirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu xác thực"
              {...register("confirmPassword")}
              className={
                errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {!showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Số điện thoại</Label>
        <Input
          id="phoneNumber"
          placeholder=""
          {...register("phoneNumber")}
          className={errors.phoneNumber ? "border-red-500" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? <LoadingSpinner text="Đang đăng ký..." /> : "Đăng ký"}
      </Button>
    </form>
  );
}
