export enum Gender {
  Male = "M",
  Female = "F",
  Other = "O",
}

export type Role = "admin" | "doctor" | "patient";

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

export interface ForgotPasswordState {
  step: 1 | 2 | 3;
  email: string;
  otp: string;
  newPassword: string;
  loading: boolean;
  error: string;
  success: string;
  payload: number;
}

export interface OtpDto {
  email: string;
  otp: string;
}
