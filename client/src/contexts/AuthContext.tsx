"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/types";
import { authService } from "@/services/auth.service";
import { tokenService } from "@/services/token.service";
import { setBearerToken } from "@/axios";
import { LoginPatientDto, RegisterPatientDto } from "@/schemas/auth";

interface AuthContextType {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userDto: LoginPatientDto) => Promise<boolean>;
  register: (patientDto: RegisterPatientDto) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Login handle
  const handleLogin = useCallback(
    async (userDto: LoginPatientDto): Promise<boolean> => {
      setIsLoading(true);
      try {
        const { data } = await authService.login(userDto);
        const { accessToken, refreshToken } = data;

        tokenService.saveTokens(accessToken, refreshToken);
        tokenService.saveUser(data);
        setAuthUser(data);
        setBearerToken(accessToken);

        return true;
      } catch {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Register handle
  const handleRegister = useCallback(
    async (patientDto: RegisterPatientDto): Promise<boolean> => {
      setIsLoading(true);
      try {
        await authService.register(patientDto);
        return true;
      } catch {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Clear user session and show logout message
  const handleLogout = useCallback(async () => {
    await authService.logout();
    tokenService.clearTokens();
    tokenService.clearStoredUser();
    setAuthUser(null);
    router.push("/");
  }, [router]);

  // Initialize auth state on component mount
  useEffect(() => {
    const user = tokenService.getStoredUser();
    if (user?.accessToken) {
      try {
        const payload = tokenService.decodePayload(user.accessToken);
        const isExpired =
          !payload || (payload.exp && Date.now() >= payload.exp * 1000);
        if (isExpired) {
          handleLogout();
        } else {
          setAuthUser(user);
          setBearerToken(user.accessToken);
        }
      } catch {
        handleLogout();
      }
    }
    setIsLoading(false);
  }, [handleLogout]);

  // Memoize context value to avoid unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      authUser,
      setAuthUser,
      isLoading,
      isAuthenticated: !!authUser,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
    }),
    [authUser, isLoading, handleLogin, handleRegister, handleLogout],
  );

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
