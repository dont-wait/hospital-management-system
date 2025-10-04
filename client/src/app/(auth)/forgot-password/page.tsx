"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/shared/Card";
import { AlertMessage } from "@/components/ui/shared/AlertMessage";
import { StepHeader } from "@/components/ui/forgot-password/StepHeader";
import { EmailStep } from "@/components/ui/forgot-password/EmailStep";
import { OtpStep } from "@/components/ui/forgot-password/OtpStep";
import { PasswordStep } from "@/components/ui/forgot-password/PasswordStep";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { useOtpClipboard } from "@/hooks/useOtpClipboard";

export default function ForgotPasswordPage() {
  const {
    state,
    updateState,
    clearMessages,
    goBack,
    resetPassword,
    verifyOtp,
    createNewPassword,
  } = useForgotPassword();

  useOtpClipboard(state.step, state.otp, (otp) => updateState({ otp }));

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <EmailStep
            email={state.email}
            isLoading={state.loading}
            onSubmit={resetPassword}
          />
        );
      case 2:
        return (
          <OtpStep
            email={state.email}
            otp={state.otp}
            loading={state.loading}
            onOtpChange={(otp) => updateState({ otp })}
            onSubmit={verifyOtp}
            onClearError={clearMessages}
          />
        );
      case 3:
        return (
          <PasswordStep
            newPassword={state.newPassword}
            loading={state.loading}
            onSubmit={createNewPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-6">
          <StepHeader step={state.step} onGoBack={goBack} />
        </CardHeader>

        <CardContent className="space-y-6">
          {state.error && <AlertMessage type="error" message={state.error} />}
          {state.success && (
            <AlertMessage type="success" message={state.success} />
          )}
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
}
