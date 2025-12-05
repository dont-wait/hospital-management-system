"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import {} from "@/services";

interface BillingManagementValue {
  billingId: number | null;
  setBillingId: (id: number | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const BillingManagementContext = createContext<BillingManagementValue | null>(
  null,
);

export function BillingManagemetnProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [billingId, setBillingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <BillingManagementContext.Provider
      value={{
        billingId,
        setBillingId,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </BillingManagementContext.Provider>
  );
}

export function useBillingManagemnt() {
  const ctx = useContext(BillingManagementContext);
  if (!ctx) {
    throw new Error(
      "useBillingManagemnt must be used inside BillingManagemetnProvider",
    );
  }
  return ctx;
}
