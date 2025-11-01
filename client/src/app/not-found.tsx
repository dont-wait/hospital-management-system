"use client";

import Skeleton from "react-loading-skeleton";
import LazySection from "@/components/shared/LazySection";
import styles from "@/styles/not-found.module.css";

const NotFound = () => {
  return (
    <LazySection
      importFunc={() => import("@/components/shared/NotFound")}
      skeleton={
        <div className={styles["not-found-skeleton-section"]}>
          <div className={styles["not-found-header"]}>
            <Skeleton width="100%" height="100%" />
          </div>

          <p className={styles["not-found-desc"]}>
            <Skeleton width="100%" height="100%" />
          </p>

          <div className={styles["not-found-button-back"]}>
            <Skeleton width="100%" height="100%" />
          </div>
        </div>
      }
    />
  );
};

export default NotFound;
