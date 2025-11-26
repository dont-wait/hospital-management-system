import { GENDER_OPTIONS } from "@/config";

export class PatientUtils {
  static formatGender(c: string | null) {
    return c
      ? (GENDER_OPTIONS.find(({ value }) => value === c)?.label ?? "")
      : "";
  }
}
