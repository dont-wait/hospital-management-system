"use client";

import { ReactNode } from "react";
import { useBookingExamContext } from "@/contexts";

interface AddBookingInfoProps {
  children?: ReactNode[];
}

export default function AddBookingInfo({ children }: AddBookingInfoProps) {
  const { state } = useBookingExamContext();
  if (!children) return null;
  const [specialty, doctor, date] = children;

  return (
    <>
      {state.priority === "department" && specialty}
      {state.priority === "doctor" && doctor}
      {state.priority === "date" && date}
    </>
  );
}
