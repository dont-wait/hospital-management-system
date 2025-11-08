import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ToastDefaultConfig } from "@/config";
import { AuthErrorResponse } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true,
});

// Dynamic import toast để tránh lỗi SSR
const showToast = async (message: string, type: "success" | "error" | "info" = "info") => {
  if (typeof window !== "undefined") {
    const { toast } = await import("react-toastify");
    toast[type](message, ToastDefaultConfig);
  }
};

const handleValidationErrors = async (data: AuthErrorResponse) => {
  if (data.errors) {
    Object.values(data.errors)
      .flat()
      .forEach((err) => {
        showToast(err, "error");
      });
  } else if (data.message) {
    showToast(data.message, "error");
  }
};

// Response interceptor
api.interceptors.response.use(
  <T>(
    response: AxiosResponse<{ status: number; message: string; data: T }>,
  ) => {
    const { status, message } = response.data;

    if (status >= 400) {
      showToast(message, "error");
      return Promise.reject(response);
    }

    showToast(message, "success");
    return response;
  },
  (
    error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>,
  ) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          handleValidationErrors(data);
          break;
        case 401:
          showToast("Phiên đăng nhập hết hạn", "error");
          break;
        case 500:
          showToast("Lỗi máy chủ. Vui lòng thử lại sau", "error");
          break;

        default:
          showToast("Có lỗi xảy ra. Vui lòng thử lại", "error");
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// API instance cho SSR
export const apiSSR = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

export const getConfig = (token?: string): AxiosRequestConfig | undefined => {
    return token ? {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    } : undefined;
}

export const getApiInstance = (token?: string) => {
    return token ? apiSSR : api;
}
