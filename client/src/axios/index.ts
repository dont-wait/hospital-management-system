import axios from "axios";
import { authService } from "@/services/auth.service";

function decodePayload(token: string) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const api = axios.create({
  baseURL: "http://localhost:5296",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  },
  withCredentials: true,
});

// Request interceptor - Thêm token và timestamp
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      const payload = decodePayload(token);
      const now = Math.floor(Date.now() / 1000);

      if (!payload || (payload.exp && now >= payload.exp)) {
        // Token hết hạn - xóa token và redirect
        authService.clearTokens();
        authService.clearStoredUser();

        // Xóa Bearer token khỏi axios headers
        delBearerToken();

        // Redirect về trang login
        window.location.href = "/login";

        return Promise.reject(new Error("Token expired"));
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (token) {
    }

    // 2. Thêm timestamp để ngăn cache
    const separator = config.url?.includes("?") ? "&" : "?";
    config.url = `${config.url}${separator}_t=${new Date().getTime()}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const setBearerToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const delBearerToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;
