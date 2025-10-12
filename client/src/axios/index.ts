import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ToastDefaultConfig } from "@/config/ToastConfig";
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

const handleValidationErrors = (data: AuthErrorResponse) => {
  if (data.errors) {
    Object.values(data.errors)
      .flat()
      .forEach((err) => {
        toast.error(err, ToastDefaultConfig);
      });
  } else if (data.message) {
    toast.error(data.message, ToastDefaultConfig);
  }
};

// Response interceptor
api.interceptors.response.use(
  <T>(
    response: AxiosResponse<{ status: number; message: string; data: T }>,
  ) => {
    const { status, message, data } = response.data;
    if (status >= 400) {
      toast.error(message, ToastDefaultConfig);
      return Promise.reject(response);
    }

    if (data) {
      if (typeof data === "object" && data !== null && "accessToken" in data) {
        const { accessToken } = data as { accessToken: string };
        if (accessToken) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;
        }
      }
    }
    toast.success(message, ToastDefaultConfig);
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

        case 500:
          toast.error("Lỗi máy chủ. Vui lòng thử lại sau", ToastDefaultConfig);
          break;

        default:
          toast.error("Có lỗi xảy ra. Vui lòng thử lại", ToastDefaultConfig);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
