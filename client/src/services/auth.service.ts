import {
  LoginPatientDto,
  LoginResponse,
  RegisterPatientDto,
  RegisterResponse,
  AuthUser,
} from "@/types";
import api from "@/axios";

class AuthService {
  private readonly STORAGE_KEYS = {
    TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER: "authUser",
  } as const;

  // Authentication methods
  async login(userDto: LoginPatientDto): Promise<LoginResponse> {
    return api
      .post("/login", userDto)
      .then((response) => response.data)
      .catch((error) => {
        const { message, response } = error;
        throw {
          message,
          response: response ? response.data : undefined,
        };
      });
  }

  async register(patientDto: RegisterPatientDto): Promise<RegisterResponse> {
    return api
      .post<RegisterResponse>("/patient/register", patientDto)
      .then((response) => response.data)
      .catch((error) => {
        const { message, response } = error;
        throw {
          message,
          response: response ? response.data : undefined,
        };
      });
  }

  saveTokens(token: string, refreshToken: string): void {
    if (token) {
      localStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    if (refreshToken) {
      localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
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

  // Authentication cleanup
  logout(): void {
    this.clearTokens();
    this.clearStoredUser();
  }
}

export const authService = new AuthService();
