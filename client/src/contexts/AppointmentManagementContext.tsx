"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { AppointmentService } from "@/services";

interface AppointmentManagementValue {
  appointmentId: number | null;
  setAppointmentId: (id: number | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  deleteAppointment: (appointmentId: number) => void;
}

const AppointmentManagementContext =
  createContext<AppointmentManagementValue | null>(null);

export function AppointmentManagemetnProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const deleteAppointment = async (appointmentId: number) => {
    if (!appointmentId) return;
    await AppointmentService.deleteAppointment(appointmentId);
  };

  return (
    <AppointmentManagementContext.Provider
      value={{
        appointmentId,
        setAppointmentId,
        currentPage,
        setCurrentPage,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentManagementContext.Provider>
  );
}

export function useAppointmentManagemnt() {
  const ctx = useContext(AppointmentManagementContext);
  if (!ctx) {
    throw new Error(
      "useAppointmentManagemnt must be used inside AppointmentManagemetnProvider",
    );
  }
  return ctx;
}
