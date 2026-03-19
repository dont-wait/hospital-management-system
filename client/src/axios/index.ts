import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import { ToastDefaultConfig } from "@/config";
import { AuthErrorResponse, ApiResponse } from "@/types";

const createBaseInstance = (): AxiosInstance => {
    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            'ngrok-skip-browser-warning': 'true',
            Pragma: "no-cache",
            Expires: "0",
        },
        withCredentials: true,
    });
};

let toastRef: typeof import("react-toastify").toast | null = null;
const showToast = async (
    message: string,
    type: "success" | "error" | "info" = "info",
) => {
    if (typeof window === "undefined") return;

    if (!toastRef) {
        const { toast } = await import("react-toastify");
        toastRef = toast;
    }

    toastRef[type](message, ToastDefaultConfig);
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
            response: AxiosResponse<ApiResponse<T>>,
        ) => {
            if (options?.withToast && response.data.message)
                showToast(response.data.message, "success");
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
                const isLogoutRequest = error.config?.url?.includes('/logout');

                switch (status) {
                    case 400:
                        if (options?.withToast) handleValidationErrors(data);
                        break;
                    case 401:
                        // Không hiển thị toast nếu đang logout
                        if (options?.withToast && !isLogoutRequest)
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

const createApiInstance = (withToast: boolean) => {
    const instance = createBaseInstance();
    attachInterceptors(instance, { withToast });
    return instance;
};

export const api = createApiInstance(true);
export const apiSSR = createApiInstance(false);

export const getConfig = (token?: string): AxiosRequestConfig => {
    return token
        ? {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        }
        : {};
};

export const getApiInstance = (
    isServer: boolean = typeof window === "undefined",
) => (isServer ? apiSSR : api);
