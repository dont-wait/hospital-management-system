import { ReactNode } from "react";
import { Mail, Shield, Key } from "@/lib/client";
import { ResetPasswordState } from "@/types";
import styles from "@/styles/auth.module.css";

export const FP_DEFAULT_STATE: ResetPasswordState = {
  step: "send",
  email: "",
  otp: "",
  maxRetries: 3,
} as const;

export const FP_ICONS: Record<string, ReactNode> = {
  send: <Mail className={styles["fp-icon"]} />,
  verify: <Shield className={styles["fp-icon"]} />,
  reset: <Key className={styles["fp-icon"]} />,
} as const;

export const FP_TITLES: Record<string, string> = {
  send: "Đổi mật khẩu",
  verify: "Xác thực OTP",
  reset: "Đặt mật khẩu mới",
} as const;

export const FP_DESCRIPTIONS: Record<string, string> = {
  send: "Nhập địa chỉ email để nhận mã xác thực",
  verify: "Nhập mã OTP đã được gửi đến email của bạn",
  reset: "Tạo mật khẩu mới cho tài khoản của bạn",
} as const;
