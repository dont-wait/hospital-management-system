import Skeleton from "react-loading-skeleton";
import { cn } from "@/lib/client";
import cardStyles from "@/styles/card.module.css";
import authStyles from "@/styles/auth.module.css";
import labelStyles from "@/styles/label.module.css";
import inputStyles from "@/styles/input.module.css";

export function LoginSkeleton() {
  return (
    <div className={cn(cardStyles["card"], authStyles["login-card"])}>
      {/* Card Header */}
      <div
        className={cn(cardStyles["card-header"], authStyles["login-header"])}
      >
        <div className={authStyles["login-header-icon-wrap"]}>
          <div className={authStyles["login-header-icon"]}>
            <Skeleton width="100%" height="100%" />
          </div>
        </div>
        <div
          className={cn(cardStyles["card-title"], authStyles["login-title"])}
        >
          <Skeleton width="60%" height="100%" />
        </div>
        <div className={cn(cardStyles["card-desc"], authStyles["login-desc"])}>
          <Skeleton width="80%" height="100%" />
        </div>
      </div>

      {/* Card Content */}
      <div
        className={cn(cardStyles["card-content"], authStyles["login-content"])}
      >
        <div className={authStyles["login-form"]}>
          {/* Form Fields */}
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

          {/* forgot password section */}
          <div className={authStyles["forgot-password-btn"]}>
            <Skeleton width="30%" height="100%" />
          </div>

          {/* submit button */}
          <div className={authStyles["submit-btn"]}>
            <Skeleton width="100%" height="100%" />
          </div>
        </div>

        {/* Footer Link */}
        <div className={authStyles["footer-link-section"]}>
          <div className={authStyles["footer-link-content"]}>
            <div className={authStyles["footer-link"]}>
              <Skeleton width="60%" height="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
