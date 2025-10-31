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
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { Loading } from "@/components";
import { AuthService, IpGeoService } from "@/services";
import { TokenUtils } from "@/lib/client";
import { Employee, Patient } from "@/types";

interface UserAuthContextType<T> {
  user: T | null;
  setUser: (user: T | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType<
  Patient | Employee
> | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Patient | Employee | null>(null);
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await AuthService.logout();
    TokenUtils.clearStoredUser();
    setUser(null);
    router.push("/");
  }, [router]);

  const getNationality = useCallback(async () => {
    try {
      const user: Patient | Employee | null = TokenUtils.getStoredUser();
      if (user && "patientId" in user) {
        const country = await IpGeoService.getCountry();
        setUser({
          ...user,
          nationality: user.nationality || country,
        } as Patient);
      }
    } catch (error) {
      console.error("Can't Initialize User", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    const hasToken = Cookie.get("hasToken") === "true";
    if (!hasToken) {
      TokenUtils.clearStoredUser();
    } else {
      getNationality();
    }
  }, [getNationality]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: !!user,
      logout: handleLogout,
    }),
    [user, handleLogout],
  );

  if (isLoading) return <Loading />;

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
