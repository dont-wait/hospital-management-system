import { LoginResponse, RegisterResponse, LogoutResponse } from "@/types";
import {
  LoginAccountDto,
  RegisterPatientDto,
  SendOtpDto,
  VerifyOtpDto,
  ResetPasswordDto,
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
  static async register(patientDto: RegisterPatientDto): Promise<boolean> {
    const { data: response }: { data: RegisterResponse } = await api.post(
      "/patient/register",
      patientDto,
    );
    return !!response;
  }

  // Logout service
  static async logout(): Promise<LogoutResponse> {
    return api.post("/logout").then((response) => {
      delete api.defaults.headers.common.Authorization;
      return response.data;
    });
  }

  // Send otp service
  static async sendOtp(sendOtpDto: SendOtpDto): Promise<void> {
    await api.post("/request-reset", sendOtpDto);
  }

  // Verify otp services
  static async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<void> {
    await api.post("/verify-otp", verifyOtpDto);
  }

  // Reset password services
  static async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await api.post("/reset-password", resetPasswordDto);
  }
}
