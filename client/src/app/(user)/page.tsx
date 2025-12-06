"use client";

import LazySection from "@/components/shared/LazySection";
import Banner from "@/components/home/Banner";
import { FeaturesSkeleton } from "@/components/skeletons/home/FeaturesSkeleton";
import { ServicesSkeleton } from "@/components/skeletons/home/ServicesSkeleton";
import { CTASkeleton } from "@/components/skeletons/home/CTASkeleton";

function HomePage() {
  return (
    <div>
      <Banner/>

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
