import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, LoadingSpinner, FormField } from "@/components";
import { resetPasswordSchema, ResetPasswordDto } from "@/schemas";
import styles from "@/styles/auth.module.css";

type PasswordStepProps = {
  resetPassword: (resetPasswordDto: ResetPasswordDto) => void;
};

export function PasswordStep({ resetPassword }: PasswordStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(resetPassword)}
      className={styles["reset-password-form"]}
    >
      <FormField
        label={null}
        id="newPassword"
        type="password"
        placeholder="Nhập mật khẩu mới"
        errors={errors}
        register={register}
      />

      <div className={styles["password-rule-wrap"]}>
        <p>Mật khẩu phải:</p>
        <ul className={styles["password-rule-wrap-list"]}>
          <li>Có ít nhất 8 ký tự</li>
          <li>Chứa chữ hoa và chữ thường</li>
          <li>Chứa ít nhất 1 số và ký tự đặc biệt</li>
        </ul>
      </div>

      <Button
        type="submit"
        className={styles["submit-btn"]}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <LoadingSpinner text="Đang cập nhật..." />
        ) : (
          "Đặt lại mật khẩu"
        )}
      </Button>
    </form>
  );
}
