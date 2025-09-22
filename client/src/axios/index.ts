import axios from "axios";

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

export const setBearerToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const delBearerToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;
