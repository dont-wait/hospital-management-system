import { useState } from "react";
import { ForgotPasswordState } from "@/types";
import { ResetPassworDto, NewPasswordDto } from "@/schemas/auth";
import api from "@/axios";

const INITIAL_STATE: ForgotPasswordState = {
  step: 1,
  email: "",
  otp: "",
  newPassword: "",
  loading: false,
  error: "",
  success: "",
  payload: 3,
};

const ERROR_MESSAGES = {
  GENERIC: "Có lỗi xảy ra. Vui lòng thử lại.",
  INVALID_OTP: "Mã OTP không chính xác. Vui lòng thử lại.",
  INVALID_PASSWORD: "Mật khẩu không hợp lệ!",
} as const;

export const useForgotPassword = () => {
  const [state, setState] = useState<ForgotPasswordState>(INITIAL_STATE);

  const updateState = (updates: Partial<ForgotPasswordState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const clearMessages = () => {
    updateState({ error: "", success: "" });
  };

  const goBack = () => {
    updateState({
      step: (state.step - 1) as 1 | 2 | 3,
      error: "",
      success: "",
    });
  };

  const resetPassword = async (resetPasswordDto: ResetPassworDto) => {
    updateState({ loading: true, error: "" });

    // Skip API call if email hasn't changed
    if (resetPasswordDto.email === state.email) {
      updateState({
        loading: false,
        step: 2,
      });
      return;
    }

    try {
      const { data } = await api.post("/request-reset", resetPasswordDto);
      updateState({
        email: resetPasswordDto.email,
        loading: false,
        step: 2,
        success: data.message,
        error: "",
      });
    } catch {
      updateState({
        loading: false,
        error: ERROR_MESSAGES.GENERIC,
      });
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState({ loading: true, error: "" });

    try {
      const { data } = await api.post("/verify-otp", {
        email: state.email,
        otp: state.otp,
      });

      updateState({
        loading: false,
        step: 3,
        payload: 3,
        success: data.message,
        error: "",
        otp: "",
      });
    } catch {
      const isLastAttempt = state.payload === 1;

      if (isLastAttempt) {
        // Reset to initial state after final failed attempt
        setState(INITIAL_STATE);
      } else {
        updateState({
          loading: false,
          error: ERROR_MESSAGES.INVALID_OTP,
          payload: state.payload - 1,
          otp: "",
        });
      }
    }
  };

  const createNewPassword = async (newPasswordDto: NewPasswordDto) => {
    updateState({ loading: true, error: "" });

    try {
      const { data } = await api.post("/reset-password", newPasswordDto);
      updateState({
        loading: false,
        success: data.message,
      });
      window.location.href = "/login";
    } catch {
      updateState({
        loading: false,
        error: ERROR_MESSAGES.INVALID_PASSWORD,
      });
    }
  };

  return {
    state,
    updateState,
    clearMessages,
    goBack,
    resetPassword,
    verifyOtp,
    createNewPassword,
  };
};
