import { cookies } from "next/headers";
import { PatientService } from "@/services/server";
import { PatientUtils } from "@/lib/client";
import AddMedicalButton from "./AddMedicalButton";
import { AuthUserWithoutTokens, Patient } from "@/types";
import styles from "@/styles/booking.module.css";

export default async function AddMedicalRecord() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const authData: AuthUserWithoutTokens =
    await PatientService.getPatientInfo(token);
  const patient: Patient | null = authData.patient;

  if (!patient) return null;

  return (
    <div className={styles["booking-box"]}>
      <h2 className={styles["booking-card-heading"]}>Thông tin hồ sơ khám</h2>

      <div className={styles["medical-record-section"]}>
        <div>
          <label className={styles["medical-record-heading"]}>Họ và tên</label>
          <div className={styles["medical-record-text"]}>
            {`${patient.firstName} ${patient.lastName}`}
          </div>
        </div>

        <div className={styles["medical-record-content"]}>
          <div>
            <label className={styles["medical-record-heading"]}>
              Ngày sinh
            </label>
            <div className={styles["medical-record-text"]}>
              {PatientUtils.formatDOB(patient.dateOfBirth)}
            </div>
          </div>

          <div>
            <label className={styles["medical-record-heading"]}>
              Giới tính
            </label>
            <div className={styles["medical-record-text"]}>
              {PatientUtils.formatGender(patient.gender)}
            </div>
          </div>
        </div>

        <div>
          <label className={styles["medical-record-heading"]}>
            Số điện thoại
          </label>
          <div className={styles["medical-record-text"]}>
            {patient.phoneNumber}
          </div>
        </div>

        <div>
          <label className={styles["medical-record-heading"]}>Địa chỉ</label>
          <div className={styles["medical-record-text"]}>{patient.address}</div>
        </div>

        <AddMedicalButton patient={patient} />
      </div>
    </div>
  );
}
