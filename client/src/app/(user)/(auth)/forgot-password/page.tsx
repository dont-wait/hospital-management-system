"use client";

import LazySection from "@/components/shared/LazySection";
import { ForgotPasswordSkeleton } from "@/components/skeletons/auth/ForgotPasswordSkeleton";
import authStyles from "@/styles/auth.module.css";

function ForgotPasswordPage() {
  return (
    <div className={authStyles["fp-page"]}>
      <LazySection
        importFunc={() =>
          import("@/components/forgot-password/ForgotPasswordCard")
        }
        skeleton={ForgotPasswordSkeleton()}
        className={authStyles["fp-card-skeleton"]}
      />
    </div>
  );
}

export default ForgotPasswordPage;
