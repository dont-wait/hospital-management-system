import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { resetPasswordSchema, ResetPasswordDto } from "@/schemas/auth";
import { useAuth } from "@/contexts/AuthContext";

interface EmailStepProps {
  email: string;
  isLoading: boolean;
  onSubmit: (resetPasswordDto: ResetPasswordDto) => Promise<void>;
}

export function EmailStep({ email, isLoading, onSubmit }: EmailStepProps) {
  const { authUser } = useAuth();
  const defaultEmail = useMemo(() => {
    return email || authUser?.employee?.email || authUser?.patient?.email || "";
  }, [authUser, email]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? <LoadingSpinner text="Đang gửi..." /> : "Tiếp tục"}
      </Button>
    </form>
  );
}

