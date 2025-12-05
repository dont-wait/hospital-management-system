"use client";

import LazySection from "@/components/shared/LazySection";
import { RegisterSkeleton } from "@/components/skeletons/auth/RegisterSkeleton";
import authStyles from "@/styles/auth.module.css";

function RegisterPage() {
  return (
    <div className={authStyles["register-page"]}>
      <LazySection
        importFunc={() => import("@/components/register/RegisterCard")}
        skeleton={<RegisterSkeleton />}
        className={authStyles["register-card-skeleton"]}
      />
    </div>
  );
}

export default RegisterPage;
