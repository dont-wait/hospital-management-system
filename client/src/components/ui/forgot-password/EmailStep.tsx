import { useMemo, memo } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordDto } from "@/schemas/auth";
import { Button } from "@/components/ui/shared/Button";
import { Input } from "@/components/ui/shared/Input";
import { LoadingSpinner } from "@/components/ui/shared/LoadingSpinner";

interface EmailStepProps {
  email: string;
  isLoading: boolean;
  onSubmit: (resetPasswordDto: ResetPasswordDto) => Promise<void>;
}

const EmailStep = memo(function EmailStep({
  email,
  isLoading,
  onSubmit,
}: EmailStepProps) {
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
    defaultValues: { email: defaultEmail },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p role="alert" className="text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? <LoadingSpinner text="Đang gửi..." /> : "Tiếp tục"}
      </Button>
    </form>
  );
});

export default EmailStep;
