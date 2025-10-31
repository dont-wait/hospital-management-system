import { GENDER_OPTIONS } from "@/config";

export class PatientUtils {
  static formatGender(c: string | null) {
    return c ? GENDER_OPTIONS.find(({ value }) => value === c)!.label : "";
  }

  static formatDOB(dob: string) {
    const [year, month, day] = dob?.split("T")[0].split("-") ?? [];
    return dob ? `${day}-${month}-${year}` : "";
  }
}
