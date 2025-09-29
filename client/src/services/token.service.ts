import { AuthUser } from "@/types";

class TokenService {
  private readonly STORAGE_KEYS = {
    TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER: "authUser",
  } as const;

  // Token management
  saveTokens(token: string, refreshToken: string): void {
    if (token) {
      sessionStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
    }
    if (refreshToken) {
      sessionStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
  }

  clearTokens(): void {
    sessionStorage.removeItem(this.STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN);
  }

  // User data management
  saveUser(user: AuthUser): void {
    sessionStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getStoredUser(): AuthUser | null {
    try {
      const userData = sessionStorage.getItem(this.STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch {
      this.clearStoredUser();
      return null;
    }
  }

  clearStoredUser(): void {
    sessionStorage.removeItem(this.STORAGE_KEYS.USER);
  }

  clearAll(): void {
    Object.values(this.STORAGE_KEYS).forEach((key) =>
      sessionStorage.removeItem(key),
    );
  }
}

export const tokenService = new TokenService();
