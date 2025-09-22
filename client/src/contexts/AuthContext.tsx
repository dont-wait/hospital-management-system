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
  AuthRegisterError,
  RegisterPatientDto,
} from "@/types";
import { authService } from "@/services/auth.service";
import { useToast } from "@/contexts/ToastContext";
import { setBearerToken, delBearerToken } from "@/axios";
import { decodePayload } from "@/lib/utils";

interface AuthContextType {
  authUser: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userDto: LoginPatientDto) => Promise<boolean>;
  register: (patientDto: RegisterPatientDto) => Promise<boolean>;
  logout: () => void;
}

interface AuthError {
  message: string;
  response: AuthRegisterError;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Format user display name based on role
  const getDisplayName = (authUser: AuthUser): string => {
    if (authUser.patient) {
      return `${authUser.patient.firstName} ${authUser.patient.lastName}`;
    } else if (authUser.employee) {
      return `Dr. ${authUser.employee.firstName} ${authUser.employee.lastName}`;
    }
    return "bạn";
  };

  // Show error messages for login or register
  const handleAuthError = (error: AuthError) => {
    const { message, response } = error;
    if (!response) {
      showToast(message, "error");
    } else {
      Object.values(response.errors)
        .flat()
        .forEach((err) => {
          showToast(err, "error");
        });
    }
  };

  // Login handle
  const handleLogin = async (userDto: LoginPatientDto): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { message, data } = await authService.login(userDto);
      if (data) {
        const { accessToken, refreshToken } = data;
        const displayName = getDisplayName(data);

        // Store token, refresh token
        authService.saveTokens(accessToken, refreshToken);
        showToast(`Đăng nhập thành công! Chào ${displayName}!`, "success");

        // Store user
        authService.saveUser(data);
        setAuthUser(data);

        // Set Bearer Token
        setBearerToken(accessToken);

        return true;
      } else {
        // Incorrect username or password
        showToast(message, "error");
        return false;
      }
    } catch (error) {
      handleAuthError(error as AuthError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handle
  const handleRegister = async (
    patientDto: RegisterPatientDto,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { message, data } = await authService.register(patientDto);
      if (data) {
        showToast(message, "success");
        return true;
      } else {
        // Password mismatch
        showToast(message, "error");
        return false;
      }
    } catch (error) {
      handleAuthError(error as AuthError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear user session and show logout message
  const handleLogout = useCallback(() => {
    showToast("Đã đăng xuất khỏi tài khoản!", "success");
    setTimeout(() => {
      setAuthUser(null);
      authService.logout();
    }, 3000);
  }, [showToast]);

  // Initialize auth state on component mount
  useEffect(() => {
    const user = authService.getStoredUser();
    if (user?.accessToken) {
      const payload = decodePayload(user.accessToken);
      const now = Math.floor(Date.now() / 1000);

      if (!payload || (payload.exp && now >= payload.exp)) {
        // Token hết hạn - xóa token
        setAuthUser(null);
        authService.logout();
        delBearerToken();
        window.location.href = "/login";
      }

      setAuthUser(user);
      setBearerToken(user.accessToken);
    }
    setIsLoading(false);
  }, []);

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
