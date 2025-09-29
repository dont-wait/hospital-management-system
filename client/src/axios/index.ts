import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { defaultOptions } from "@/lib/toast";
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

// Request interceptor - Thêm token và timestamp
api.interceptors.request.use(
  (config) => {
    const separator = config.url?.includes("?") ? "&" : "?";
    config.url = `${config.url}${separator}_t=${new Date().getTime()}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const handleValidationErrors = (data: AuthErrorResponse) => {
  if (data.errors) {
    Object.values(data.errors)
      .flat()
      .forEach((err) => {
        toast.error(err, defaultOptions);
      });
  } else if (data.message) {
    toast.error(data.message, defaultOptions);
  }
};

// Response interceptor - Thêm token và timestamp
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (
    error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>,
  ) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          // Bad Request
          handleValidationErrors(data);
          break;

        case 500:
          // Internal Server Error
          toast.error("Lỗi máy chủ. Vui lòng thử lại sau", defaultOptions);
          break;

        default:
          toast.error("Có lỗi xảy ra. Vui lòng thử lại", defaultOptions);
      }
    }

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
