"use client";

import Link from "next/link";
import Icon from "@/components/shared/Icon";
import { useUserAuthContext } from "@/contexts";
import { cn } from "@/lib/client";
import patientStyles from "@/styles/patient.module.css";
import cardStyles from "@/styles/card.module.css";
import buttonStyles from "@/styles/button.module.css";
import { Patient } from "@/types";

function PatientListGroup() {
  const { user } = useUserAuthContext();
  const patientId = (user as Patient)?.patientId ?? "";
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
            href={`/patient/appointment-management/${patientId}`}
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
            href={`/patient/billing/${patientId}`}
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
