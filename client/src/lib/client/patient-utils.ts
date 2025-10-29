import { GENDER_OPTIONS } from "@/config";

export class PatientUtils {
  static formatGender(c: string) {
    return GENDER_OPTIONS.find(({ value }) => value === c)!.label;
  }

  static formatDOB(dob: string) {
    const [year, month, day] = dob.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  }
}
