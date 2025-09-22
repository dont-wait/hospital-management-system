export enum Gender {
  Male = "M",
  Female = "F",
  Other = "O",
}

export type Role = "admin" | "doctor" | "patient";

export interface LoginPatientDto {
  citizenID: string;
  password: string;
}

export interface RegisterPatientDto {
  citizenID: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

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

export interface AuthRegisterError {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]>;
  traceId: string;
  message: string;
}
