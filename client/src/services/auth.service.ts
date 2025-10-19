import { LoginResponse, RegisterResponse, LogoutResponse } from "@/types";
import {
  LoginAccountDto,
  RegisterPatientDto,
  ResetPasswordDto,
  NewPasswordDto,
} from "@/schemas";
import api from "@/axios";
import { TokenService } from "@/services";
import { Patient, Employee } from "@/types";

export class AuthService {
  // Login service
  static async login(userDto: LoginAccountDto): Promise<Patient | Employee> {
    const { data: response }: { data: LoginResponse } = await api.post(
      "/login",
      userDto,
    );
    if (response.data?.patient) {
      const user: Patient = {
        ...response.data.patient,
        avatarUrl: response.data.avatarUrl,
      };
      TokenService.saveUser<Patient>(user);
      return user;
    }
    return response.data.employee as Employee;
  }

  // Register service
  static async register(
    patientDto: RegisterPatientDto,
  ): Promise<RegisterResponse> {
    return api
      .post<RegisterResponse>("/patient/register", patientDto)
      .then((response) => response.data);
  }

  // Logout service
  static async logout(): Promise<LogoutResponse> {
    return api.post("/logout").then((response) => {
      delete api.defaults.headers.common.Authorization;
      return response.data;
    });
  }

  // Reset password service
  static async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return api
      .post("/request-reset", resetPasswordDto)
      .then((response) => response.data);
  }

  // Verify otp services
  static async verifyOtp(email: string, otp: string) {
    return api
      .post("/verify-otp", { email, otp })
      .then((response) => response.data);
  }

  // Create new password services
  static async newPassword(newPasswordDto: NewPasswordDto) {
    return api
      .post("/reset-password", newPasswordDto)
      .then((response) => response.data);
  }
}
