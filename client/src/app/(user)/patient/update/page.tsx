"use client";

import { Card, CardContent } from "@/components/shared/Card";
import LazySection from "@/components/shared/LazySection";
import Skeleton from "react-loading-skeleton";

function UpdatePatientPage() {
  return (
    <LazySection
      importFunc={() => import("@/components/patient/UpdateCard")}
      skeleton={
        <Card className="w-full p-2 shadow-none border-0">
          <CardContent className="space-y-4 w-full md:w-4/6 mx-auto">
            {/* Avatar */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Skeleton
                  width={94}
                  height={94}
                  style={{ borderRadius: "50%" }}
                />
                <Skeleton width={115} height={40} className="rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Patient Info*/}
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton width={100} height={16} />
                    <Skeleton width="100%" height={40} />
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton width={100} height={16} />
                    <Skeleton width="100%" height={40} />
                  </div>
                ))}

                <div className="space-y-2">
                  <Skeleton width={100} height={16} />
                  <Skeleton width="100%" height={114} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton width={100} height={16} />
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <Skeleton width="100%" height={40} />
                <Skeleton width="100%" height={40} />
                <Skeleton width="100%" height={40} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-6">
                <Skeleton
                  width={16}
                  height={16}
                  style={{ borderRadius: "50%" }}
                />
                <Skeleton width={30} height={14} />

                <Skeleton
                  width={16}
                  height={16}
                  style={{ borderRadius: "50%" }}
                />
                <Skeleton width={28} height={14} />

                <Skeleton
                  width={16}
                  height={16}
                  style={{ borderRadius: "50%" }}
                />
                <Skeleton width={31} height={14} />
              </div>

              <Skeleton width="100%" height={48} />
            </div>
          </CardContent>
        </Card>
      }
    />
  );
}

export default UpdatePatientPage;
