import { Button } from "@/components/shared/Button";
import { Label } from "@/components/shared/Label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/forgot-password/InputOtp";

interface OtpStepProps {
  email: string;
  otp: string;
  loading: boolean;
  onOtpChange: (otp: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClearError: () => void;
}

function OtpStep({
  email,
  otp,
  loading,
  onOtpChange,
  onSubmit,
  onClearError,
}: OtpStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="text-center">
          <Label className="text-sm font-medium text-gray-700">
            Mã xác thực
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            Đã gửi đến: <span className="font-medium">{email}</span>
          </p>
        </div>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => {
              onOtpChange(value);
              onClearError();
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-xs text-center text-gray-500">
          Mã OTP sẽ tự động điền khi bạn copy từ email
        </p>
      </div>
      <Button
        type="submit"
        className="w-full h-12"
        disabled={loading || otp.length !== 6}
      >
        {loading ? <LoadingSpinner text="Đang xác thực..." /> : "Xác thực"}
      </Button>
    </form>
  );
}

export default OtpStep;
