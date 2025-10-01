import { useEffect } from "react";

export const useOtpClipboard = (
  step: number,
  currentOtp: string,
  onOtpChange: (otp: string) => void,
) => {
  useEffect(() => {
    if (step !== 2) return;

    let interval: NodeJS.Timeout;

    const requestClipboardPermission = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: "clipboard-read" as PermissionName,
        });

        if (permission.state === "denied") {
          console.warn("Clipboard permission denied");
          return false;
        }

        // If prompt, try to read clipboard to trigger permission request
        if (permission.state === "prompt") {
          await navigator.clipboard.readText();
        }

        return true;
      } catch (error) {
        console.error("Clipboard permission error:", error);
        return false;
      }
    };

    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const otpMatch = text.match(/\b\d{6}\b/);

        if (otpMatch && otpMatch[0] !== currentOtp) {
          onOtpChange(otpMatch[0]);
        }
      } catch {
        // Silently handle clipboard read errors
      }
    };

    const initClipboardMonitoring = async () => {
      const hasPermission = await requestClipboardPermission();

      if (hasPermission) {
        interval = setInterval(checkClipboard, 2000);
      }
    };

    initClipboardMonitoring();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, currentOtp, onOtpChange]);
};
