"use client";

import { lazy, Suspense, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/shared/Card";
import { AlertMessage } from "@/components/ui/shared/AlertMessage";
import { StepHeader } from "@/components/ui/forgot-password/StepHeader";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { useOtpClipboard } from "@/hooks/useOtpClipboard";

const EmailStep = lazy(
  () => import("@/components/ui/forgot-password/EmailStep"),
);
const OtpStep = lazy(() => import("@/components/ui/forgot-password/OtpStep"));
const PasswordStep = lazy(
  () => import("@/components/ui/forgot-password/PasswordStep"),
);

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

  const renderStep = useMemo(() => {
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
  }, [
    state.step,
    state.email,
    state.otp,
    state.newPassword,
    state.loading,
    resetPassword,
    updateState,
    verifyOtp,
    clearMessages,
    createNewPassword,
  ]);

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
          <Suspense fallback={<div>Loading...</div>}>{renderStep}</Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
