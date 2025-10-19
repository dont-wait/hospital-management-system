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
import { Employee, Patient } from "@/types";

interface UserAuthContextType<T> {
  user: T | null;
  setUser: (user: T) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType<
  Patient | Employee
> | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Patient | Employee | null>(null);
  const router = useRouter();

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
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: !!user,
      logout: handleLogout,
    }),
    [user, handleLogout],
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
