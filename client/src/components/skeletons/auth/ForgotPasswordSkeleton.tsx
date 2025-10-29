import Skeleton from "react-loading-skeleton";
import { cn } from "@/lib/client";
import cardStyles from "@/styles/card.module.css";
import authStyles from "@/styles/auth.module.css";
import labelStyles from "@/styles/label.module.css";
import inputStyles from "@/styles/input.module.css";
import progressStyles from "@/styles/progress.module.css";

export function ForgotPasswordSkeleton() {
  return (
    <div className={cn(cardStyles["card"], authStyles["fp-card"])}>
      <div
        className={cn(cardStyles["card-header"], authStyles["fp-card-header"])}
      >
        {/* Progress Bar */}
        <div
          className={cn(
            progressStyles["progress-section"],
            authStyles["progress"],
          )}
        >
          <Skeleton width="100%" height="100%" />
        </div>

        {/* Card Header */}
        <div className={authStyles["fp-header"]}>
          <div className={authStyles["fp-header-wrap"]}>
            <div className={authStyles["fp-header-icon-wrap"]}>
              <Skeleton width="100%" height="100%" />
            </div>
          </div>
          <div>
            <div
              className={cn(
                cardStyles["card-title"],
                authStyles["fp-header-title"],
              )}
            >
              <Skeleton width="60%" height="100%" />
            </div>
            <div className={cn(cardStyles["card-desc"], authStyles["fp-desc"])}>
              <Skeleton width="80%" height="100%" />
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          cardStyles["card-content"],
          authStyles["fp-card-content"],
        )}
      >
        <div className={authStyles["send-otp-form"]}>
          {/* Form Fields */}
          <div className={authStyles["form-group"]}>
            <div className={labelStyles["label"]}>
              <Skeleton width="30%" height="100%" />
            </div>
            <div className={inputStyles["input-skeleton"]}>
              <Skeleton width="100%" height="100%" />
            </div>
          </div>

          {/* Submit Button */}
          <div className={authStyles["submit-btn"]}>
            <Skeleton width="100%" height="100%" />
          </div>
        </div>
      </div>
    </div>
  );
}
