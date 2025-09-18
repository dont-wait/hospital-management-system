"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  AuthUser,
  LoginPatientDto,
  PatientRegisterError,
  RegisterPatientDto,
} from "@/types";
import { authService } from "@/services/auth.service";
import { useToast } from "@/contexts/ToastContext";

interface AuthContextType {
  authUser: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userDto: LoginPatientDto) => Promise<boolean>;
  register: (patientDto: RegisterPatientDto) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Clear all authentication data from state and storage
  const clearAuthState = useCallback(() => {
    setAuthUser(null);
    authService.clearTokens();
    authService.clearStoredUser();
  }, []);

  // Format user display name based on role
  const getDisplayName = (authUser: AuthUser): string => {
    if ("patientId" in authUser.user) {
      return authUser.user.firstName;
    } else if ("doctorId" in authUser.user) {
      return `Dr. ${authUser.user.firstName}`;
    }
    return "Admin";
  };

  // Show success message with user's display name
  const showLoginSuccessMessage = (user: AuthUser) => {
    const displayName = getDisplayName(user);
    showToast(`Đăng nhập thành công! Chào bạn, ${displayName}!`, "success");
  };

  // Initialize auth state from stored data on app startup
  const initializeAuth = useCallback(async () => {
    clearAuthState();
    setIsLoading(false);
  }, [clearAuthState]);

  // Authenticate user with credentials
  const handleLogin = async (userDto: LoginPatientDto): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login(userDto);

      authService.saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
      );
      authService.saveUser(response.data);
      setAuthUser(response.data);

      showLoginSuccessMessage(response.data);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      const displayMessage =
        errorMessage === "Invalid credentials"
          ? "Mật khẩu hoặc tên đăng nhập không chính xác!"
          : "Đăng nhập thất bại. Hãy thử lại!";

      showToast(displayMessage, "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register new patient account
  const handleRegister = async (
    patientDto: RegisterPatientDto,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.register(patientDto);
      showToast(response.message, "success");
      return true;
    } catch (error) {
      const { message, response } = error as {
        message: string;
        response: PatientRegisterError;
      };

      if (!response) {
        showToast(message, "error");
      } else {
        Object.values(response.errors)
          .flat()
          .forEach((err) => {
            showToast(err, "error");
          });
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear user session and show logout message
  const handleLogout = useCallback(() => {
    clearAuthState();
    showToast("Đã đăng xuất khỏi tài khoản!", "success");
  }, [clearAuthState, showToast]);

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const contextValue: AuthContextType = {
    authUser,
    isLoading,
    isAuthenticated: !!authUser,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Hook to access auth context with error handling
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
