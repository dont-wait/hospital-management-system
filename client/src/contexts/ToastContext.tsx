"use client";

import { createContext, useContext, ReactNode } from "react";
import { ToastContainer, toast } from "react-toastify";
import { defaultOptions } from "@/lib/toast";
import "react-toastify/dist/ReactToastify.css";

interface ToastContextType {
  showToast: (message: string, type?: "error" | "success" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (
    message: string,
    type: "error" | "success" | "info" = "error",
  ) => {
    const action =
      {
        error: toast.error,
        success: toast.success,
        info: toast.info,
      }[type] || toast;

    action(message, defaultOptions);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
