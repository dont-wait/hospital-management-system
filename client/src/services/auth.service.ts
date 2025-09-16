import {
  LoginPatientDto,
  LoginResponse,
  RegisterPatientDto,
  RegisterResponse,
  AuthUser,
} from "@/types";
import { mockData } from "@/mock-data";

class AuthService {
  // Configuration
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
  private readonly STORAGE_KEYS = {
    TOKEN: "hospital_access_token",
    REFRESH_TOKEN: "hospital_refresh_token",
    USER: "hospital_user",
  } as const;

  // Simulate network delay
  private delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Authentication methods
  async login(userDto: LoginPatientDto): Promise<LoginResponse> {
    await this.delay(1000);

    // In real implementation: make API call to server
    const user = this.validateCredentials(userDto);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Mock tokens - in real app, these come from server response
    const accessToken = "mock_access_token";
    const refreshToken = "mock_refresh_token";
    const authUser: AuthUser = { ...user, accessToken, refreshToken };

    return {
      status: 200,
      message: "Đăng nhập thành công!",
      data: authUser,
    };
  }

  async register(patientDto: RegisterPatientDto): Promise<RegisterResponse> {
    await this.delay(1500);

    // In real implementation: make API call to server
    console.log("Registering patient:", patientDto);

    return {
      success: true,
      message: "Registration successful",
    };
  }

  saveTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
  }

  clearTokens(): void {
    Object.values(this.STORAGE_KEYS).forEach((key) =>
      localStorage.removeItem(key),
    );
  }

  // User data management
  saveUser(user: AuthUser): void {
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getStoredUser(): AuthUser | null {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch {
      this.clearStoredUser();
      return null;
    }
  }

  clearStoredUser(): void {
    localStorage.removeItem(this.STORAGE_KEYS.USER);
  }

  // Utility methods
  isTokenExpired(token: string): boolean {
    try {
      if (token.startsWith("mock_jwt_")) {
        const payload = JSON.parse(atob(token.replace("mock_jwt_", "")));
        return payload.exp < Date.now() / 1000;
      }
      // TODO: Use proper JWT library for real tokens
      return false;
    } catch {
      return true;
    }
  }

  // Authentication cleanup - call when user logs out
  logout(): void {
    this.clearTokens();
    this.clearStoredUser();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  // Private helpers
  private validateCredentials(userDto: LoginPatientDto) {
    return mockData.find((user) => user.citizenID === userDto.citizenID);
  }
}

export const authService = new AuthService();
