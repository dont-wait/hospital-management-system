import { LoginResponse, RegisterResponse, LogoutResponse } from "@/types";
import {
  LoginPatientDto,
  RegisterPatientDto,
  ResetPassworDto,
  NewPasswordDto,
} from "@/schemas/auth";
import api from "@/axios";

class AuthService {
  // Login service
  async login(userDto: LoginPatientDto): Promise<LoginResponse> {
    return api.post("/login", userDto).then((response) => response.data);
  }

  // Register service
  async register(patientDto: RegisterPatientDto): Promise<RegisterResponse> {
    return api
      .post<RegisterResponse>("/patient/register", patientDto)
      .then((response) => response.data);
  }

  // Logout service
  async logout(): Promise<LogoutResponse> {
    return api.post("/logout").then((response) => response.data);
  }

  // Reset password service
  async resetPassword(resetPasswordDto: ResetPassworDto) {
    return api
      .post("/request-reset", resetPasswordDto)
      .then((response) => response.data);
  }

  // Verify otp services
  async verifyOtp(email: string, otp: string) {
    return api
      .post("/verify-otp", { email, otp })
      .then((response) => response.data);
  }

  // Create new password services
  async newPassword(newPasswordDto: NewPasswordDto) {
    return api
      .post("/reset-password", newPasswordDto)
      .then((response) => response.data);
  }
}

export const authService = new AuthService();
