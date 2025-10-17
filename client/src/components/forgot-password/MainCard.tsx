import { lazy } from "react";
import { Card, CardContent, CardHeader } from "@/components/shared/Card";
import { AlertMessage } from "@/components/shared/AlertMessage";
import { StepHeader } from "@/components/forgot-password/StepHeader";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { useOtpClipboard } from "@/hooks/useOtpClipboard";

const EmailStep = lazy(() => import("@/components/forgot-password/EmailStep"));
const OtpStep = lazy(() => import("@/components/forgot-password/OtpStep"));
const PasswordStep = lazy(
  () => import("@/components/forgot-password/PasswordStep"),
);

function MainCard() {
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

export default MainCard;
