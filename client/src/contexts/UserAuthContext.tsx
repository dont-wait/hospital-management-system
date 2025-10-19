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
import { AuthService, TokenService } from "@/services";
import { RegisterPatientDto } from "@/schemas";
import { Employee, Patient } from "@/types";

interface UserAuthContextType<T> {
  user: T | null;
  setUser: (user: T) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
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
      register: handleRegister,
      logout: handleLogout,
    }),
    [user, isLoading, handleRegister, handleLogout],
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
