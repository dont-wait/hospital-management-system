import axios from "axios";

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
    // 1. Thêm Bearer Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Thêm timestamp để ngăn cache
    const separator = config.url?.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}_t=${new Date().getTime()}`;

    return config;
  },
  (error) => {
    console.error('Request Error!');
    return Promise.reject(error);
  }
);

export default api;
