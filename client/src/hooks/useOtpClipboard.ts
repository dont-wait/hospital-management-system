import { useEffect } from "react";

export const useOtpClipboard = (
  step: number,
  currentOtp: string,
  onOtpChange: (otp: string) => void,
) => {
  useEffect(() => {
    if (step === 2) {
      const checkClipboard = async () => {
        const text = await navigator.clipboard.readText();
        const otpMatch = text.match(/\b\d{6}\b/);
        if (otpMatch && otpMatch[0] !== currentOtp) {
          onOtpChange(otpMatch[0]);
        }
      };

      const interval = setInterval(checkClipboard, 2000);
      return () => clearInterval(interval);
    }
  }, [step, currentOtp, onOtpChange]);
};
