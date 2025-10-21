import { useForm } from "react-hook-form";
import { Button, LoadingSpinner, OtpInput } from "@/components";
import styles from "@/styles/auth.module.css";

type OtpStepProps = {
  verifyOtp: ({ otp }: { otp: string }) => void;
};

export function OtpStep({ verifyOtp }: OtpStepProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(verifyOtp)}
      className={styles["verify-otp-form"]}
    >
      <OtpInput control={control} />
      <Button
        type="submit"
        className={styles["submit-btn"]}
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoadingSpinner text="Đang xác thực..." /> : "Xác thực"}
      </Button>
    </form>
  );
}
