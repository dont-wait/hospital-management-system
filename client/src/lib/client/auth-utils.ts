import { Role } from "@/types";

export class TokenUtils {
  static readonly STORAGE_KEYS = {
    USER: "userInfo",
  } as const;

  static saveUser<T>(user: T): void {
    sessionStorage.setItem(TokenUtils.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getStoredUser<T>(): T | null {
    try {
      const userData = sessionStorage.getItem(TokenUtils.STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch {
      TokenUtils.clearStoredUser();
      return null;
    }
  }

  static clearStoredUser(): void {
    sessionStorage.removeItem(TokenUtils.STORAGE_KEYS.USER);
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

  static isTokenExpired(token: string): boolean {
    const payload = TokenUtils.decodePayload(token);
    if (!payload?.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  static getUserRole(token: string): Role {
    const payload = TokenUtils.decodePayload(token);
    if (!payload?.exp) return "patient";
    return payload.RoleId;
  }
}
