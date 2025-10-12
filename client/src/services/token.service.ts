import { AuthUser } from "@/types";

class TokenService {
  static readonly STORAGE_KEYS = {
    USER: "authUser",
  } as const;

  static saveUser(user: AuthUser): void {
    sessionStorage.setItem(
      TokenService.STORAGE_KEYS.USER,
      JSON.stringify(user),
    );
  }

  static getStoredUser(): AuthUser | null {
    try {
      const userData = sessionStorage.getItem(TokenService.STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch {
      TokenService.clearStoredUser();
      return null;
    }
  }

  static clearStoredUser(): void {
    sessionStorage.removeItem(TokenService.STORAGE_KEYS.USER);
  }

  static decodePayload(token: string) {
    try {
      const base64 = token.split(".")[1];
      const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}

export default TokenService;
