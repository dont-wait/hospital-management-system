import { cookies } from "next/headers";
import Icon from "@/components/shared/Icon";
import { PatientService } from "@/services/server";
import { PatientUtils, DateUtils } from "@/lib/client";
import AddMedicalButton from "./AddMedicalButton";
import { AuthUserWithoutTokens, Patient } from "@/types";
import styles from "@/styles/booking.module.css";

export default async function AddMedicalRecord() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const authData: AuthUserWithoutTokens =
    await PatientService.getPatientInfo(token);
  const patient: Patient | null = authData.patient;

  function hasEmptyOrWhitespace(patient: Patient): boolean {
    return Object.values(patient).some((value) => value === null);
  }

  if (!patient) return null;
  if (patient && hasEmptyOrWhitespace(patient)) {
    return (
      <div className="border-2 border-mauve rounded-md p-8 bg-martinique shadow-lg mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 mx-auto bg-mauve rounded-full flex items-center justify-center">
                <Icon name="Info" />
              </div>
            </div>
            <h3 className="text-center text-xl my-1 font-bold text-white">
              Hoàn thiện thông tin bệnh nhân
            </h3>
            <p className="text-center text-silver">
              Vui lòng cập nhật đầy đủ thông tin cá nhân để tạo hồ sơ khám bệnh.
            </p>

            <a
              href="/patient/update"
              className="flex items-center text-center mt-4 gap-2 px-6 py-3 bg-east-bay text-white font-semibold rounded-lg shadow-md"
            >
              Cập nhật thông tin
            </a>
          </div>
        </div>
      </div>
    );
  }

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
              {DateUtils.getDisplayDateTime(
                patient.dateOfBirth,
                "DayMonthYear",
              )}
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
