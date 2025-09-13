import { LoginCredentials, PatientRegisterData, AuthUser } from "@/types";
import { mockUsers } from "@/mock-data";

// Response types
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
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.delay(1000);

    // In real implementation: make API call to server
    const user = this.validateCredentials(credentials);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Mock tokens - in real app, these come from server response
    const token = "mock_jwt_token_from_server";
    const refreshToken = "mock_refresh_token_from_server";
    const authUser: AuthUser = { ...user, token, refreshToken };

    return {
      user: authUser,
      token,
      refreshToken,
    };
  }

  async register(data: PatientRegisterData): Promise<RegisterResponse> {
    await this.delay(1500);

    // In real implementation: make API call to server
    console.log("Registering patient:", data);

    return {
      success: true,
      message: "Registration successful",
    };
  }

  async refreshToken(): Promise<LoginResponse> {
    await this.delay(500);

    const refreshToken = this.getRefreshToken();
    const storedUser = this.getStoredUser();

    if (!refreshToken || !storedUser) {
      throw new Error("Authentication data unavailable");
    }

    // In real implementation: make API call with refresh token

    // Mock new tokens from server response
    const newToken = "new_mock_jwt_token_from_server";
    const newRefreshToken = "new_mock_refresh_token_from_server";
    const user = {
      ...storedUser,
      token: newToken,
      refreshToken: newRefreshToken,
    };

    return {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }

  // Token management
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
  private validateCredentials(credentials: LoginCredentials) {
    return mockUsers.find(
      (user) =>
        user.userAccount.username === credentials.username &&
        user.userAccount.password === credentials.password,
    );
  }
}

export const authService = new AuthService();
