"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { defaultBookingData, bookingSteps } from "@/config";
import { useToast } from "@/contexts";
import { AppointmentService } from "@/services";
import {
  BookingDoctor,
  BookingData,
  Priority,
  Patient,
  AppointmentDto,
} from "@/types";

export type BookingAction =
  | { type: "SET_STEP"; step: number }
  | { type: "NEXT_STEP"; step: number }
  | { type: "PREV_STEP"; step: number }
  | { type: "SET_PRIORITY"; priority: Priority }
  | { type: "SET_PATIENT"; patient: Patient }
  | { type: "SET_DEPARTMENT_INFO"; id: number; name: string }
  | { type: "SET_DATE"; date: string }
  | {
      type: "SET_APPOINTMENT_INFO";
      doctor: BookingDoctor;
      departmentId: number;
      departmentName: string;
      date: string;
      slotTimeId: number;
      slotTime: string;
      roomName: string;
      price: number;
    }
  | { type: "RESET_FILTER" }
  | { type: "ADD_RECORD" }
  | { type: "REMOVE_RECORD"; departmentName: string };

function reducer(state: BookingData, action: BookingAction): BookingData {
  switch (action.type) {
    case "NEXT_STEP":
    case "PREV_STEP":
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_PRIORITY":
      return { ...state, priority: action.priority };
    case "SET_PATIENT":
      return { ...state, patient: action.patient };
    case "SET_DEPARTMENT_INFO":
      return { ...state, departmentId: action.id, departmentName: action.name };
    case "SET_DATE":
      return { ...state, date: action.date };
    case "SET_APPOINTMENT_INFO":
      return {
        ...state,
        doctor: action.doctor,
        departmentId: action.departmentId,
        departmentName: action.departmentName,
        date: action.date,
        slotTimeId: action.slotTimeId,
        slotTime: action.slotTime,
        roomName: action.roomName,
        price: action.price,
      };
    case "ADD_RECORD":
      return {
        ...state,
        records: [
          ...state.records,
          {
            patient: state.patient!,
            departmentId: state.departmentId!,
            departmentName: state.departmentName!,
            doctor: state.doctor!,
            date: state.date,
            slotTimeId: state.slotTimeId!,
            slotTime: state.slotTime,
            roomName: state.roomName,
            price: state.price,
          },
        ],
      };
    case "REMOVE_RECORD":
      return {
        ...state,
        records: state.records.filter(
          (record) => record.departmentName !== action.departmentName,
        ),
      };
    case "RESET_FILTER":
      return {
        ...state,
        departmentId: null,
        departmentName: "",
        date: "",
        doctor: null,
      };
    default:
      return state;
  }
}

interface BookingProviderProps {
  children: ReactNode;
}

interface BookingContextValue {
  state: BookingData;
  nextStep: () => void;
  prevStep: () => void;
  setDepartment: (id: number, name: string) => void;
  setDate: (date: string) => void;
  addBookingRecord: () => void;
  removeBookingRecord: (departmentName: string) => void;
  confirmBooking: () => void;
  changeToStepOne: (patient: Patient) => void;
  changeToStepTwo: (priority: Priority) => void;
  changeToStepThree: (
    doctor: BookingDoctor,
    departmentId: number,
    departmentName: string,
    date: string,
    slotTimeId: number,
    slotTime: string,
    roomName: string,
    price: number,
  ) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: BookingProviderProps) {
  const [state, dispatch] = useReducer(reducer, defaultBookingData);
  const { showToast } = useToast();

  const nextStep = () => {
    dispatch({
      type: "NEXT_STEP",
      step: Math.min(state.step + 1, bookingSteps.length),
    });
  };

  const prevStep = () => {
    const isEmpty: boolean =
      state.departmentName === "" && state.date === "" && state.doctor === null;
    if (state.step !== 2 || isEmpty) {
      dispatch({
        type: "PREV_STEP",
        step: Math.max(state.step - 1, 0),
      });
    }

    const hasDepartmentOnly: boolean =
      !!state.departmentName && !state.date && !state.doctor;
    const hasDateOnly: boolean =
      !state.departmentName && !!state.date && !state.doctor;
    const hasDoctorOnly: boolean =
      !state.departmentName && !state.date && !!state.doctor;
    let priority: Priority = "date";

    if (hasDepartmentOnly) priority = "department";
    else if (hasDateOnly) priority = "date";
    else if (hasDoctorOnly) priority = "doctor";

    dispatch({ type: "SET_PRIORITY", priority });
    dispatch({ type: "RESET_FILTER" });
  };

  const changeToStepOne = (patient: Patient) => {
    dispatch({ type: "SET_PATIENT", patient });
    nextStep();
  };

  const changeToStepTwo = (priority: Priority) => {
    dispatch({ type: "SET_PRIORITY", priority });
    nextStep();
  };

  const setDepartment = (id: number, name: string) => {
    dispatch({ type: "SET_DEPARTMENT_INFO", id, name });
    const priority: Priority =
      state.priority === "department" && !state.date ? "date" : "doctor";
    dispatch({ type: "SET_PRIORITY", priority });
  };

  const setDate = (date: string) => {
    dispatch({ type: "SET_DATE", date });
    const priority: Priority =
      state.priority === "date" && !state.departmentName
        ? "department"
        : "doctor";
    dispatch({ type: "SET_PRIORITY", priority });
  };

  const addBookingRecord = () => {
    dispatch({
      type: "SET_STEP",
      step: 1,
    });

    dispatch({ type: "RESET_FILTER" });
  };

  const removeBookingRecord = (departmentName: string) => {
    dispatch({ type: "REMOVE_RECORD", departmentName });
  };

  const changeToStepThree = (
    doctor: BookingDoctor,
    departmentId: number,
    departmentName: string,
    date: string,
    slotTimeId: number,
    slotTime: string,
    roomName: string,
    price: number,
  ) => {
    dispatch({
      type: "SET_APPOINTMENT_INFO",
      doctor,
      departmentId,
      departmentName,
      date,
      slotTimeId,
      slotTime,
      roomName,
      price,
    });

    const isValid: boolean = state.records.every(
      (record) => record.departmentName !== departmentName,
    );
    if (!isValid) {
      showToast("Chuyên khoa này đã được chọn!", "info");
    } else {
      dispatch({ type: "ADD_RECORD" });
    }
    nextStep();
  };

  const confirmBooking = async () => {
    const appointmentDto: AppointmentDto = {
      patientId: state.patient!.patientId,
      appointmentSlots: state.records.map((record) => ({
        appointmentDate: record.date.split("/").reverse().join("-"),
        doctorId: record.doctor.doctorId,
        departmentId: record.departmentId,
        slotTimeId: record.slotTimeId,
      })),
    };
    const response = await AppointmentService.createAppointment(appointmentDto);
    showToast(response.message, "success");
    nextStep();
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        nextStep,
        prevStep,
        setDepartment,
        setDate,
        addBookingRecord,
        removeBookingRecord,
        confirmBooking,
        changeToStepOne,
        changeToStepTwo,
        changeToStepThree,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingExamContext() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error(
      "useBookingExamContext must be used inside BookingProvider",
    );
  }
  return ctx;
}
