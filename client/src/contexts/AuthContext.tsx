"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AuthUser, LoginCredentials, PatientRegisterData } from "@/types";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: PatientRegisterData) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token expiration check interval and role display mappings
const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const ROLE_DISPLAY_NAMES: Record<string, string> = {
  doctor: "Dr.",
  patient: "",
  admin: "Admin",
} as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clear all authentication data from state and storage
  const clearAuthState = useCallback(() => {
    setUser(null);
    authService.clearTokens();
    authService.clearStoredUser();
  }, []);

  // Format user display name based on role
  const getDisplayName = (user: AuthUser): string => {
    const rolePrefix = ROLE_DISPLAY_NAMES[user.role.role_id] || "";
    return user.role.role_id === "patient"
      ? user.profile.ep_firstname
      : `${rolePrefix} ${user.profile.ep_lastname}`.trim();
  };

  // Show success message with user's display name
  const showLoginSuccessMessage = (user: AuthUser) => {
    const displayName = getDisplayName(user);
    toast.success(`Đăng nhập thành công! Chào bạn, ${displayName}!`);
  };

  // Refresh JWT token and update user state
  const handleRefreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();
      authService.saveTokens(response.token, response.refreshToken);
      authService.saveUser(response.user);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthState();
      return false;
    }
  }, [clearAuthState]);

  // Check if token is expired and refresh if needed
  const checkTokenExpiration = useCallback(async () => {
    const token = authService.getToken();
    if (token && authService.isTokenExpired(token)) {
      await handleRefreshToken();
    }
  }, [handleRefreshToken]);

  // Initialize auth state from stored data on app startup
  const initializeAuth = useCallback(async () => {
    try {
      const storedUser = authService.getStoredUser();
      const token = authService.getToken();

      if (storedUser && token) {
        if (authService.isTokenExpired(token)) {
          await handleRefreshToken();
        } else {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  }, [handleRefreshToken, clearAuthState]);

  // Authenticate user with credentials
  const handleLogin = async (
    credentials: LoginCredentials,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);

      authService.saveTokens(response.token, response.refreshToken);
      authService.saveUser(response.user);
      setUser(response.user);

      showLoginSuccessMessage(response.user);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      const displayMessage =
        errorMessage === "Invalid credentials"
          ? "Mật khẩu hoặc tên đăng nhập không chính xác!"
          : "Đăng nhập thất bại. Hãy thử lại!";

      toast.error(displayMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register new patient account
  const handleRegister = async (
    data: PatientRegisterData,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      toast.success("Đăng ký thành công!");
      return response.success;
    } catch {
      toast.error("Đăng ký thất bại. Hãy thử lại!");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear user session and show logout message
  const handleLogout = useCallback(() => {
    clearAuthState();
    toast.success("Đã đăng xuất khỏi tài khoản!");
  }, [clearAuthState]);

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Set up periodic token expiration check
  useEffect(() => {
    if (!user?.token) return;

    const interval = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [user?.token, checkTokenExpiration]);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
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
