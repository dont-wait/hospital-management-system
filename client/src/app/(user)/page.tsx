"use client";

import LazySection from "@/components/shared/LazySection";
import {
  BannerSkeleton,
  FeaturesSkeleton,
  ServicesSkeleton,
  CTASkeleton,
} from "@/components/skeletons";

function HomePage() {
  return (
    <div>
      <LazySection
        importFunc={() => import("@/components/home/Banner")}
        skeleton={<BannerSkeleton />}
      />

      <LazySection
        importFunc={() => import("@/components/home/FeaturesSection")}
        skeleton={<FeaturesSkeleton />}
      />

      <LazySection
        importFunc={() => import("@/components/home/ServicesSection")}
        skeleton={<ServicesSkeleton />}
      />

      <LazySection
        importFunc={() => import("@/components/home/CTASection")}
        skeleton={<CTASkeleton />}
      />
    </div>
  );
}

export default HomePage;
