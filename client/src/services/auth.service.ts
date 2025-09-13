import { LoginCredentials, PatientRegisterData, AuthUser } from "@/types";
import { mockUsers } from "@/mock-data";

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

class AuthService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
  private readonly TOKEN_KEY = "hospital_access_token";
  private readonly REFRESH_TOKEN_KEY = "hospital_refresh_token";
  private readonly USER_KEY = "hospital_user";

  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.delay(1000);

    // Mock authentication logic - replace with actual API call
    const mockUser = mockUsers.find(
      (user) =>
        user.userAccount.username === credentials.username &&
        this.validatePassword(credentials.password, user.userAccount.password),
    );

    if (!mockUser) {
      throw new Error("Invalid credentials");
    }

    // Generate mock tokens
    const token = "";
    const refreshToken = "";

    const authUser: AuthUser = {
      ...mockUser,
      token,
      refreshToken,
    };

    return {
      user: authUser,
      token,
      refreshToken,
    };
  }

  async register(data: PatientRegisterData): Promise<RegisterResponse> {
    await this.delay(1500);

    // Mock registration logic - replace with actual API call
    console.log("Registering patient:", data);

    return {
      success: true,
      message: "Registration successful",
    };
  }

  async refreshToken(): Promise<LoginResponse> {
    await this.delay(500);

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Mock refresh logic - replace with actual API call
    const storedUser = this.getStoredUser();
    if (!storedUser) {
      throw new Error("No user data available");
    }

    const newToken = "";
    const newRefreshToken = "";

    return {
      user: { ...storedUser, token: newToken, refreshToken: newRefreshToken },
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }

  // Token management methods
  saveTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // User data management
  saveUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getStoredUser(): AuthUser | null {
    const savedUser = localStorage.getItem(this.USER_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        this.clearStoredUser();
        return null;
      }
    }
    return null;
  }

  clearStoredUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Helper methods
  private validatePassword(
    inputPassword: string,
    storedPassword: string,
  ): boolean {
    return inputPassword === storedPassword;
  }

  isTokenExpired(token: string): boolean {
    try {
      if (token.startsWith("mock_jwt_")) {
        const payload = JSON.parse(atob(token.replace("mock_jwt_", "")));
        return payload.exp < Math.floor(Date.now() / 1000);
      }
      // For real JWT tokens, use a proper JWT library
      return false;
    } catch {
      return true;
    }
  }
}

export const authService = new AuthService();
