import Skeleton from "react-loading-skeleton";
import { cn } from "@/lib/client";
import cardStyles from "@/styles/card.module.css";
import patientStyles from "@/styles/patient.module.css";
import authStyles from "@/styles/auth.module.css";
import avatarStyles from "@/styles/avatar.module.css";
import labelStyles from "@/styles/label.module.css";
import inputStyles from "@/styles/input.module.css";

export function PatientUpdateSkeleton() {
  return (
    <div
      className={cn(cardStyles["card"], patientStyles["patient-update-card"])}
    >
      <div className={cardStyles["card-content"]}>
        <div className={patientStyles["patient-content"]}>
          {/* Avatar */}
          <div className={authStyles["form-group"]}>
            <div className={avatarStyles["avatar-upload"]}>
              <div
                className={cn(
                  avatarStyles["avatar-image-frame"],
                  "border-none",
                )}
                style={{ width: 96, height: 96 }}
              >
                <Skeleton width="100%" height="100%" />
              </div>
              <div>
                <Skeleton width={114.43} height={40} />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className={patientStyles["info-section"]}>
            <div className={patientStyles["patient-content"]}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={authStyles["form-group"]}>
                  <div className={labelStyles["label"]}>
                    <Skeleton width="30%" height="100%" />
                  </div>
                  <div className={inputStyles["input-skeleton"]}>
                    <Skeleton width="100%" height="100%" />
                  </div>
                </div>
              ))}
            </div>

            <div className={patientStyles["patient-content"]}>
              {[...Array(2)].map((_, index) => (
                <div key={index} className={authStyles["form-group"]}>
                  <div className={labelStyles["label"]}>
                    <Skeleton width="30%" height="100%" />
                  </div>
                  <div className={inputStyles["input-skeleton"]}>
                    <Skeleton width="100%" height="100%" />
                  </div>
                </div>
              ))}
              <div className={authStyles["form-group"]}>
                <div className={labelStyles["label"]}>
                  <Skeleton width="30%" height="100%" />
                </div>
                <div className={inputStyles["textarea-skeleton"]}>
                  <Skeleton width="100%" height="100%" />
                </div>
              </div>
            </div>
          </div>
          <div className={authStyles["form-group"]}>
            <div className={labelStyles["label"]}>
              <Skeleton width="15%" height="100%" />
            </div>
            <div className={inputStyles["date-input"]}>
              {[...Array(3)].map((_, index) => (
                <div key={index} className={authStyles["form-group"]}>
                  <div className={inputStyles["input-skeleton"]}>
                    <Skeleton width="100%" height="100%" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {[...Array(2)].map((_, index) => (
            <div key={index} className={authStyles["submit-btn"]}>
              <Skeleton width="100%" height="100%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
