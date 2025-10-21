import { ReactNode } from "react";
import { FP_ICONS, FP_TITLES, FP_DESCRIPTIONS } from "@/config";
import { forgotPasswordStep } from "@/types";

export function getStepNumber(step: forgotPasswordStep): number {
  return step === "send" ? 1 : step === "verify" ? 2 : 3;
}

export function getStepIcon(step: forgotPasswordStep): ReactNode | null {
  return FP_ICONS[step] || null;
}

export function getStepTitle(step: forgotPasswordStep): string | null {
  return FP_TITLES[step] || null;
}

export function getStepDescription(step: forgotPasswordStep): string | null {
  return FP_DESCRIPTIONS[step] || null;
}
