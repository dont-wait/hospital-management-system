import Skeleton from "react-loading-skeleton";
import { cn } from "@/lib/client";
import cardStyles from "@/styles/card.module.css";
import authStyles from "@/styles/auth.module.css";
import labelStyles from "@/styles/label.module.css";
import inputStyles from "@/styles/input.module.css";

export function RegisterSkeleton() {
  return (
    <div className={cn(cardStyles["card"], authStyles["register-card"])}>
      {/* Card Header */}
      <div
        className={cn(cardStyles["card-header"], authStyles["register-header"])}
      >
        <div className={authStyles["register-header-icon-wrap"]}>
          <Skeleton
            width="100%"
            height="100%"
            circle={true}
            containerClassName={authStyles["icon-skeleton"]}
          />
        </div>
        <div
          className={cn(cardStyles["card-title"], authStyles["register-title"])}
        >
          <Skeleton width="60%" height="100%" />
        </div>
        <div
          className={cn(cardStyles["card-desc"], authStyles["register-desc"])}
        >
          <Skeleton width="80%" height="100%" />
        </div>
      </div>

      {/* Card Content */}
      <div
        className={cn(
          cardStyles["card-content"],
          authStyles["register-content"],
        )}
      >
        <div className={authStyles["register-form"]}>
          <div className={authStyles["register-groups"]}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className={authStyles["form-group"]}>
                <div className={labelStyles["label"]}>
                  <Skeleton width="30%" height="100%" />
                </div>
                <div className={inputStyles["input-skeleton"]}></div>
              </div>
            ))}
          </div>

          <div className={authStyles["form-group"]}>
            <div className={labelStyles["label"]}>
              <Skeleton width="30%" height="100%" />
            </div>
            <div className={inputStyles["input-skeleton"]}></div>
          </div>

          <div className={authStyles["submit-btn"]}>
            <Skeleton width="100%" height="100%" />
          </div>
        </div>

        {/* Card Footer */}
        <Skeleton
          width="100%"
          height="100%"
          containerClassName={authStyles["footer-link-section"]}
        />
      </div>
    </div>
  );
}
