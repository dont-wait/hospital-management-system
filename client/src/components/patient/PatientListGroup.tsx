import Link from "next/link";
import { Icon } from "@/components";
import { cn } from "@/lib/client";
import patientStyles from "@/styles/patient.module.css";
import cardStyles from "@/styles/card.module.css";
import buttonStyles from "@/styles/button.module.css";

function PatientListGroup() {
  return (
    <section className={cardStyles["card"]}>
      <div className={cardStyles["card-header"]}>
        <div className={cardStyles["card-title"]}>Chức năng</div>
      </div>
      <div
        className={cn(
          cardStyles["card-content"],
          patientStyles["patient-content"],
        )}
      >
        <div
          className={cn(
            buttonStyles["button"],
            buttonStyles["button-outline"],
            patientStyles["patient-helper-btn"],
          )}
        >
          <Icon
            name="Calendar"
            className={patientStyles["patient-helper-icon"]}
          />
          Lịch khám
        </div>
        <Link href="/forgot-password" className={patientStyles["patient-link"]}>
          <div
            className={cn(
              buttonStyles["button"],
              buttonStyles["button-outline"],
              patientStyles["patient-helper-btn"],
            )}
          >
            <Icon
              name="FileText"
              className={patientStyles["patient-helper-icon"]}
            />
            Đổi mật khẩu
          </div>
        </Link>
        <Link href="/patient/update" className={patientStyles["patient-link"]}>
          <div
            className={cn(
              buttonStyles["button"],
              buttonStyles["button-outline"],
              patientStyles["patient-helper-btn"],
            )}
          >
            <Icon
              name="Pencil"
              className={patientStyles["patient-helper-icon"]}
            />
            Cập nhật hồ sơ
          </div>
        </Link>
      </div>
    </section>
  );
}

export default PatientListGroup;
