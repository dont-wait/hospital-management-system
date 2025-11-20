import { ReactNode } from "react";

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export enum Gender {
  Male = "M",
  Female = "F",
  Other = "O",
}

export const roles = ["admin", "guest", "doctor", "patient", "hod"] as const;

export type Role = (typeof roles)[number];

export interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  address: string;
  placeOfResidence: string;
  avatarUrl: string;
}

export interface Doctor {
  doctorId: string;
  specialization: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
  hireDate: string;
  certificateNumber: string;
}

export interface Employee {
  employeeId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  hireDate: string;
  certificateNumber: string;
  specialization: string;
  avatarUrl: string;
  roleId: Role;
}

export interface AuthUser {
  userAccountId: string;
  citizenID: string;
  avatarUrl: string;
  is_Active: boolean;
  patient: Patient | null;
  employee: Employee | null;
  accessToken: string;
  refreshToken: string;
}

export type AuthUserWithoutTokens = Omit<
  AuthUser,
  "accessToken" | "refreshToken"
>;

export interface LoginResponse {
  status: number;
  message: string;
  data: AuthUser;
}

export interface RegisterResponse {
  status: number;
  message: string;
  data: Patient;
}

export interface LogoutResponse {
  status: number;
  message: string;
}

export interface AuthErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export type forgotPasswordStep = "send" | "verify" | "reset";

export interface ResetPasswordState {
  step: forgotPasswordStep;
  email: string;
  otp: string;
  maxRetries: number;
}

export interface OtpDto {
  email: string;
  otp: string;
}

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
};
export interface WorkShift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  shiftStatus: "Scheduled" | "Completed" | "Canceled";
  attendanceStatus?: "checked-in" | "late" | "not-checked-in" | "checked-out";
  actualCheckInTime?: string;
}
