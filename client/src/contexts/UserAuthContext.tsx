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
import AuthService from "@/services/auth.service";
import TokenService from "@/services/token.service";
import { LoginAccountDto, RegisterPatientDto } from "@/schemas/auth";
import { Employee, Patient, LoginResponse } from "@/types";

interface UserAuthContextType<T> {
  user: T | null;
  setUser: (user: T) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userDto: LoginAccountDto) => Promise<boolean>;
  register: (patientDto: RegisterPatientDto) => Promise<boolean>;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType<
  Patient | Employee
> | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Patient | Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Login handle
  const handleLogin = useCallback(
    async (userDto: LoginAccountDto): Promise<boolean> => {
      setIsLoading(true);
      try {
        const { data }: LoginResponse = await AuthService.login(userDto);
        if (data.patient) {
          const user: Patient = {
            ...data.patient,
            avatarUrl: data.avatarUrl,
          };
          TokenService.saveUser<Patient>(user);
          setUser(user);
        }
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
        await AuthService.register(patientDto);
        return true;
      } catch {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    await AuthService.logout();
    TokenService.clearStoredUser();
    setUser(null);
    router.push("/");
  }, [router]);

  useEffect(() => {
    const user: Patient | Employee | null = TokenService.getStoredUser();
    if (user && "patientId" in user) {
      setUser(user as Patient);
    }
    setIsLoading(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isLoading,
      isAuthenticated: !!user,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
    }),
    [user, isLoading, handleLogin, handleRegister, handleLogout],
  );

  return (
    <UserAuthContext.Provider value={contextValue}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuthContext() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
