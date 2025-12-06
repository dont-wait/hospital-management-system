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
          <Skeleton
            width="100%"
            height="100%"
            circle={true}
            containerClassName={authStyles["icon-skeleton"]}
          />
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
          <Skeleton
            width="30%"
            height="100%"
            containerClassName={authStyles["forgot-password-btn"]}
          />

          {/* submit button */}
          <div className={cn(authStyles["submit-btn"])}>
            <Skeleton width="100%" height="100%" />
          </div>
        </div>

        {/* Footer Link */}
        <Skeleton
          width="100%"
          height="100%"
          containerClassName={authStyles["footer-link-section"]}
        />
      </div>
    </div>
  );
}
