import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, LoadingSpinner, FormField } from "@/components";
import { sendOtpSchema, SendOtpDto } from "@/schemas";
import { useUserAuthContext } from "@/contexts";
import { ResetPasswordState } from "@/types";
import styles from "@/styles/auth.module.css";

type EmailStepProps = {
  state: ResetPasswordState;
  sendOtp: (sendOtpDto: SendOtpDto) => void;
};

export function EmailStep({ state, sendOtp }: EmailStepProps) {
  const { user } = useUserAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SendOtpDto>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email: state.email || user?.email },
  });

  return (
    <form onSubmit={handleSubmit(sendOtp)} className={styles["send-otp-form"]}>
      <div className={styles["form-group"]}>
        <FormField
          id="email"
          label={null}
          type="email"
          placeholder="example@email.com"
          errors={errors}
          register={register}
        />
      </div>
      <Button
        type="submit"
        className={styles["submit-btn"]}
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoadingSpinner text="Đang gửi..." /> : "Tiếp tục"}
      </Button>
    </form>
  );
}
