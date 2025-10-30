import { LoginResponse, RegisterResponse, LogoutResponse } from "@/types";
import {
  LoginAccountDto,
  RegisterPatientDto,
  SendOtpDto,
  VerifyOtpDto,
  ResetPasswordDto,
} from "@/schemas";
import api from "@/axios";
import { TokenUtils } from "@/lib/client";
import { Patient, Employee } from "@/types";

export class AuthService {
  // Login service
  static async login(
    userDto: LoginAccountDto,
  ): Promise<Patient | Employee | null> {
    const { data: response }: { data: LoginResponse } = await api.post(
      "auth/login",
      userDto,
    );
    let user: Patient | Employee;
    if (response.data?.patient) {
      user = {
        ...response.data.patient,
        avatarUrl: response.data.avatarUrl,
      };
      TokenUtils.saveUser<Patient>(user);
      return user;
    }

    if (response.data?.employee) {
      user = {
        ...response.data.employee,
        avatarUrl: response.data.avatarUrl,
      };
      TokenUtils.saveUser<Employee>(user);
      return user;
    }

    return null;
  }

  // Register service
  static async register(patientDto: RegisterPatientDto): Promise<boolean> {
    const { data: response }: { data: RegisterResponse } = await api.post(
      "auth/patient/register",
      patientDto,
    );
    return !!response;
  }

  // Logout service
  static async logout(): Promise<LogoutResponse> {
    return api.post("auth/logout").then((response) => {
      delete api.defaults.headers.common.Authorization;
      return response.data;
    });
  }

  // Send otp service
  static async sendOtp(sendOtpDto: SendOtpDto): Promise<void> {
    await api.post("auth/request-reset", sendOtpDto);
  }

  // Verify otp services
  static async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<void> {
    await api.post("auth/verify-otp", verifyOtpDto);
  }

  // Reset password services
  static async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await api.post("auth/reset-password", resetPasswordDto);
  }
}
