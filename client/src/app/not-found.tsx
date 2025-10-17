"use client";

import Skeleton from "react-loading-skeleton";
import LazySection from "@/components/shared/LazySection";

const NotFound = () => {
  return (
    <LazySection
      importFunc={() => import("@/components/shared/NotFound")}
      skeleton={
        <div
          className="flex flex-col items-center justify-center gap-6 bg-gray-50"
          style={{ height: "calc(100vh - 64.8px)" }}
        >
          <Skeleton width={276} height={160} className="rounded-md" />
          <Skeleton width={528} height={36} className="rounded-md" />
          <Skeleton width={177} height={44} className="rounded-md" />
        </div>
      }
    />
  );
};

export default NotFound;
