"use client";

import Skeleton from "react-loading-skeleton";
import LazySection from "@/components/ui/shared/LazySection";

function HomePage() {
  return (
    <div>
      <LazySection
        importFunc={() => import("@/components/ui/home/Banner")}
        skeleton={
          <section className="py-20 px-4 bg-gray-50 shadow">
            <div className="max-w-6xl mx-auto text-center">
              <Skeleton
                height={60}
                width="55vw"
                className="mx-auto mb-6 rounded"
              />
              <Skeleton count={3} width="40vw" className="mx-auto mb-2" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <Skeleton height={48} width={160} className="rounded" />
                <Skeleton height={48} width={160} className="rounded" />
              </div>
            </div>
          </section>
        }
      />

      <LazySection
        importFunc={() => import("@/components/ui/home/FeaturesSection")}
        skeleton={
          <section className="py-16 px-4 shadow">
            <div className="max-w-6xl mx-auto p-2 text-center">
              <Skeleton
                height={60}
                width="30vw"
                className="mx-auto mb-12 rounded "
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={`card-${index}`}
                    className="shadow-lg p-4 rounded-md border-1"
                  >
                    <Skeleton
                      height="3rem"
                      width="3rem"
                      className="mx-auto mb-4 rounded-md"
                    />
                    <Skeleton
                      height={40}
                      width="80%"
                      className="mx-auto mb-2 rounded-md"
                    />
                    <Skeleton
                      height={18}
                      width="90%"
                      count={3}
                      className="mx-auto mb-1 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
      />

      <LazySection
        importFunc={() => import("@/components/ui/home/ServicesSection")}
        skeleton={
          <section className="py-16 px-4 shadow">
            <div className="max-w-6xl mx-auto p-2 text-center">
              <Skeleton
                height={60}
                width="30vw"
                className="mx-auto mb-12 rounded "
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50">
                {[...Array(9)].map((_, index) => (
                  <div
                    key={`card-${index}`}
                    className="shadow-lg p-4 rounded-md border-1 text-left"
                  >
                    <Skeleton
                      height={30}
                      width="20%"
                      className="mb-2 rounded-md"
                    />
                    <Skeleton
                      height={18}
                      width="90%"
                      count={2}
                      className="mx-auto mb-1 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
      />

      <LazySection
        importFunc={() => import("@/components/ui/home/CTASection")}
        skeleton={
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <Skeleton height={60} width="55vw" className="mb-6 rounded-md" />
              <Skeleton
                height={20}
                width="60vw"
                count={2}
                className="mb-2 rounded-md"
              />
              <Skeleton height={40} width={200} className="my-4 rounded-md" />
            </div>
          </section>
        }
      />
    </div>
  );
}

export default HomePage;
