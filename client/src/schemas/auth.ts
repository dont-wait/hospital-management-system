import { z } from "zod";

export const accountSchema = z.object({
  citizenID: z.string().min(1, "CCCD không được để trống"),
  password: z.string().min(1, "Password Không được để trống"),
});

export const patientSchema = z.object({
  citizenID: z.string().min(1, "CCCD không được để trống"),
  password: z.string().min(1, "Password Không được để trống"),
  confirmPassword: z.string().min(1, "Confirm Password không được để trống"),
  firstName: z.string().min(1, "Tên không được để trống"),
  lastName: z.string().min(1, "Họ và tên đệm không được để trống"),
  email: z.email("Email không hợp lệ"),
  phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
});

export type ResetPassworDto = z.infer<typeof resetPasswordSchema>;

export const newPasswordSchema = z.object({
  newPassword: z.string().min(1, "Mật khẩu mới không được để trống"),
});

export type NewPasswordDto = z.infer<typeof newPasswordSchema>;
