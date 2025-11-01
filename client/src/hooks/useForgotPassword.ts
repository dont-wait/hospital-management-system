import { useRouter } from "next/navigation";
import { ReactNode, useReducer, useCallback } from "react";
import { AuthService } from "@/services";
import { SendOtpDto, VerifyOtpDto, ResetPasswordDto } from "@/schemas";
import { ResetPasswordState, forgotPasswordStep } from "@/types";
import {
  FP_DEFAULT_STATE,
  FP_ICONS,
  FP_TITLES,
  FP_DESCRIPTIONS,
} from "@/config";

export type ResetPasswordAction =
  | { type: "NEXT_STEP"; step: forgotPasswordStep }
  | { type: "SET_EMAIL"; email: string }
  | { type: "SET_OTP"; otp: string }
  | { type: "SET_MAX_RETRIES"; maxRetries: number };

function reducer(
  state: ResetPasswordState,
  action: ResetPasswordAction,
): ResetPasswordState {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: action.step };
    case "SET_EMAIL":
      return { ...state, email: action.email };
    case "SET_OTP":
      return { ...state, otp: action.otp };
    case "SET_MAX_RETRIES":
      return { ...state, maxRetries: action.maxRetries };
    default:
      return state;
  }
}

export function useForgotPassword() {
  // FP - Forgot Password
  const [state, dispatch] = useReducer(reducer, FP_DEFAULT_STATE);
  const router = useRouter();

  const handleSendOtp = useCallback(
    async (sendOtpDto: SendOtpDto): Promise<void> => {
      if (state.maxRetries === 3) await AuthService.sendOtp(sendOtpDto);
      dispatch({ type: "SET_EMAIL", email: sendOtpDto.email });
      dispatch({ type: "NEXT_STEP", step: "verify" });
    },
    [state.maxRetries],
  );

  const handleVerifyOtp = useCallback(
    async ({ otp }: { otp: string }): Promise<void> => {
      try {
        const verifyOtpDto: VerifyOtpDto = {
          otp,
          email: state.email,
        };
        await AuthService.verifyOtp(verifyOtpDto);
        dispatch({ type: "SET_OTP", otp });
        dispatch({ type: "NEXT_STEP", step: "reset" });
      } catch {
        dispatch({ type: "SET_MAX_RETRIES", maxRetries: state.maxRetries - 1 });
        if (state.maxRetries === 1) {
          dispatch({ type: "SET_MAX_RETRIES", maxRetries: 3 });
          dispatch({ type: "NEXT_STEP", step: "send" });
        }
      }
    },
    [state.email, state.maxRetries],
  );

  const handleResetPassword = useCallback(
    async (resetPasswordDto: ResetPasswordDto): Promise<void> => {
      await AuthService.resetPassword(resetPasswordDto);
      dispatch({ type: "NEXT_STEP", step: "send" });
      dispatch({ type: "SET_MAX_RETRIES", maxRetries: 3 });
      router.push("/login");
    },
    [router],
  );

  return {
    state,
    sendOtp: handleSendOtp,
    verifyOtp: handleVerifyOtp,
    resetPassword: handleResetPassword,
  };
}

export function getStepNumber(step: forgotPasswordStep): number {
  return step === "send" ? 1 : step === "verify" ? 2 : 3;
}

export function getStepIcon(step: forgotPasswordStep): ReactNode | null {
  return FP_ICONS[step] || null;
}

export function getStepTitle(step: forgotPasswordStep): string | null {
  return FP_TITLES[step] || null;
}

export function getStepDescription(step: forgotPasswordStep): string | null {
  return FP_DESCRIPTIONS[step] || null;
}
