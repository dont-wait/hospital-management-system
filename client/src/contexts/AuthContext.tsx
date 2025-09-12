"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, LoginCredentials, RegisterData } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On first visit, check if user is logged in. If yes, fetch previous data 
    // for processing, else do nothing.
    const savedUser = localStorage.getItem("hospital_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("hospital_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic
      if (
        credentials.username === "doctor@hospital.com" &&
        credentials.password === "doctor123"
      ) {
        const mockUser: AuthUser = {
          userAccount: {
            ua_id: "1",
            ua_username: "doctor@hospital.com",
            ua_password: "",
            is_active: true,
            ep_id: "1",
          },
          profile: {
            ep_id: "1",
            ep_firstname: "Dr. John",
            ep_lastname: "Smith",
            ep_dob: "1985-03-15",
            ep_gender: "Male",
            ep_phonenumber: "+1234567890",
            ep_hire_date: "2020-01-15",
            ep_certificate_number: "DOC12345",
            email: "doctor@hospital.com",
            role_id: "1",
          },
          role: {
            role_id: "1",
            role_description: "Doctor",
          },
        };

        setUser(mockUser);
        localStorage.setItem("hospital_user", JSON.stringify(mockUser));
        toast.success("Đăng nhập thành công! Chào bạn, Dr. Smith!");
        setIsLoading(false);
        return true;
      } else if (
        credentials.username === "patient@hospital.com" &&
        credentials.password === "patient123"
      ) {
        const mockUser: AuthUser = {
          userAccount: {
            ua_id: "2",
            ua_username: "patient@hospital.com",
            ua_password: "",
            is_active: true,
            pt_id: "1",
          },
          profile: {
            pt_id: "1",
            pt_firstname: "Jane",
            pt_lastname: "Doe",
            pt_dob: "1990-07-20",
            pt_nationality: "American",
            email: "patient@hospital.com",
            pt_gender: "Female",
            pt_place_of_residence: "New York, NY",
            pt_is_insurance: true,
            pt_contact_number: "+1987654321",
            pt_registration_date: "2024-01-10",
            role_id: "2",
          },
          role: {
            role_id: "2",
            role_description: "Patient",
          },
        };

        setUser(mockUser);
        localStorage.setItem("hospital_user", JSON.stringify(mockUser));
        toast.success("Đăng nhập thành công! Xin chào Jane!");
        setIsLoading(false);
        return true;
      }

      toast.error("Mật khẩu hoặc tên đăng nhập không chính xác!");
      setIsLoading(false);
      return false;
    } catch {
      toast.error("Đăng nhập thất bại. Hãy thử lại!");
      setIsLoading(false);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        "Đăng ký thành công!.",
      );
      setIsLoading(false);
      return true;
    } catch {
      toast.error("Đăng ký thất bại. Hãy thử lại!");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hospital_user");
    toast.success("Đã đăng xuất khỏi tài khoản!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
