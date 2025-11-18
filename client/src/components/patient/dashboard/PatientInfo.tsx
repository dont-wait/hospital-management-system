import { cookies } from "next/headers";
import { Icon } from "@/components";
import { ButtonActiveModal } from "@/components/patient/dashboard/ButtonActiveModal";
import { PatientService } from "@/services/server";
import { AuthUserWithoutTokens, Patient } from "@/types";
import { cn } from "@/lib/client";
import patientStyles from "@/styles/patient.module.css";
import cardStyles from "@/styles/card.module.css";
import buttonStyles from "@/styles/button.module.css";
import labelStyles from "@/styles/label.module.css";

export default async function PatientInfo() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const authData: AuthUserWithoutTokens =
    await PatientService.getPatientInfo(token);
  const patient: Patient | null = authData.patient;

  return (
    <>
      <section className={cardStyles["card"]}>
        <div className={cardStyles["card-header"]}>
          <div className={cardStyles["card-title"]}>Thông tin bệnh nhân</div>
        </div>
        {patient && (
          <div
            className={cn(
              cardStyles["card-content"],
              patientStyles["patient-content"],
            )}
          >
            <div className={patientStyles["info-section"]}>
              <button
                className={cn(
                  buttonStyles["button"],
                  buttonStyles["button-outline"],
                  patientStyles["patient-helper-btn"],
                )}
              >
                <div className={patientStyles["patient-helper-icon"]}>
                  <Icon name="User" />
                </div>
                <div
                  className={cn(
                    labelStyles["label"],
                    patientStyles["patient-info-label"],
                  )}
                >
                  {`Tên bệnh nhân: ${patient.firstName} ${patient.lastName}`}
                </div>
              </button>

              <button
                className={cn(
                  buttonStyles["button"],
                  buttonStyles["button-outline"],
                  patientStyles["patient-helper-btn"],
                )}
              >
                <div className={patientStyles["patient-helper-icon"]}>
                  <Icon name="Mail" />
                </div>
                <div
                  className={cn(
                    labelStyles["label"],
                    patientStyles["patient-info-label"],
                  )}
                >
                  {`Email: ${patient.email}`}
                </div>
              </button>

              <button
                className={cn(
                  buttonStyles["button"],
                  buttonStyles["button-outline"],
                  patientStyles["patient-helper-btn"],
                )}
              >
                <div className={patientStyles["patient-helper-icon"]}>
                  <Icon name="Phone" />
                </div>
                <div
                  className={cn(
                    labelStyles["label"],
                    patientStyles["patient-info-label"],
                  )}
                >
                  {`Số điện thoại: ${patient.phoneNumber}}`}
                </div>
              </button>
            </div>
            {patient && <ButtonActiveModal patient={patient} />}
          </div>
        )}
      </section>
    </>
  );
}
