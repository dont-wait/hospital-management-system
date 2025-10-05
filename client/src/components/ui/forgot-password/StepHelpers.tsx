import { Mail, Shield, Key } from "@/lib/client/utils";

export const getStepIcon = (step: number) => {
  const icons = {
    1: <Mail className="w-6 h-6" />,
    2: <Shield className="w-6 h-6" />,
    3: <Key className="w-6 h-6" />,
  };
  return icons[step as keyof typeof icons] || null;
};

export const getStepTitle = (step: number) => {
  const titles = {
    1: "Quên mật khẩu",
    2: "Xác thực OTP",
    3: "Đặt mật khẩu mới",
  };
  return titles[step as keyof typeof titles];
};

export const getStepDescription = (step: number) => {
  const descriptions = {
    1: "Nhập địa chỉ email để nhận mã xác thực",
    2: "Nhập mã OTP đã được gửi đến email của bạn",
    3: "Tạo mật khẩu mới cho tài khoản của bạn",
  };
  return descriptions[step as keyof typeof descriptions];
};
