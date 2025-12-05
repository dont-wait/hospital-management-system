import Link from "next/link";
import Icon from "@/components/shared/Icon";
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            href="/patient/appointment-management"
            className={patientStyles["patient-link"]}
          >
            <div
              className={cn(
                buttonStyles["button"],
                buttonStyles["button-outline"],
                patientStyles["patient-helper-btn"],
              )}
            >
              <div
                className={cn(
                  buttonStyles["button"],
                  buttonStyles["button-outline"],
                  patientStyles["patient-helper-btn"],
                )}
              >
                <div className={patientStyles["patient-helper-icon"]}>
                  <Icon name="Calendar" />
                </div>
                Lịch khám
              </div>
            </div>
          </Link>
          <Link
            href="/patient/billing"
            className={patientStyles["patient-link"]}
          >
            <div
              className={cn(
                buttonStyles["button"],
                buttonStyles["button-outline"],
                patientStyles["patient-helper-btn"],
              )}
            >
              <div
                className={cn(
                  buttonStyles["button"],
                  buttonStyles["button-outline"],
                  patientStyles["patient-helper-btn"],
                )}
              >
                <div className={patientStyles["patient-helper-icon"]}>
                  <Icon name="Album" />
                </div>
                Hóa đơn
              </div>
            </div>
          </Link>
        </div>
        <Link href="/forgot-password" className={patientStyles["patient-link"]}>
          <div
            className={cn(
              buttonStyles["button"],
              buttonStyles["button-outline"],
              patientStyles["patient-helper-btn"],
            )}
          >
            <div className={patientStyles["patient-helper-icon"]}>
              <Icon name="FileText" />
            </div>
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
            <div className={patientStyles["patient-helper-icon"]}>
              <Icon name="Pencil" />
            </div>
            Cập nhật hồ sơ
          </div>
        </Link>
      </div>
    </section>
  );
}

export default PatientListGroup;
