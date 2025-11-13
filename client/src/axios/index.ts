import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ToastDefaultConfig } from "@/config";
import { AuthErrorResponse } from "@/types";

const createBaseInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    withCredentials: true,
  });
};

const showToast = async (
  message: string,
  type: "success" | "error" | "info" = "info",
) => {
  if (typeof window !== "undefined") {
    const { toast } = await import("react-toastify");
    toast[type](message, ToastDefaultConfig);
  }
};

const handleValidationErrors = async (data: AuthErrorResponse) => {
  if (data.errors) {
    Object.values(data.errors)
      .flat()
      .forEach((err) => showToast(err, "error"));
  } else if (data.message) {
    showToast(data.message, "error");
  }
};

const attachInterceptors = (
  instance: AxiosInstance,
  options?: { withToast?: boolean },
) => {
  instance.interceptors.response.use(
    <T>(
      response: AxiosResponse<{ status: number; message: string; data: T }>,
    ) => {
      const { status, message } = response.data;
      if (status >= 400) {
        if (options?.withToast) showToast(message, "error");
        return Promise.reject(response);
      }
      if (options?.withToast) showToast(message, "success");
      return response;
    },
    (
      error: AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>,
    ) => {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            if (options?.withToast) handleValidationErrors(data);
            break;
          case 401:
            if (options?.withToast)
              showToast("Phiên đăng nhập hết hạn", "error");
            break;
          case 500:
            if (options?.withToast)
              showToast("Lỗi máy chủ. Vui lòng thử lại sau", "error");
            break;
          default:
            if (options?.withToast)
              showToast("Có lỗi xảy ra. Vui lòng thử lại", "error");
        }
      }
      return Promise.reject(error);
    },
  );
};

export const api = createBaseInstance();
export const apiSSR = createBaseInstance();

attachInterceptors(api, { withToast: true });
attachInterceptors(apiSSR, { withToast: false });

export const getConfig = (token?: string): AxiosRequestConfig | undefined => {
  return token
    ? {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    : undefined;
};

export const getApiInstance = (
  isServer: boolean = typeof window === "undefined",
) => (isServer ? apiSSR : api);
