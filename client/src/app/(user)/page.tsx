"use client";

import Banner from "@/components/home/Banner";
import FeaturesSection from "@/components/home/FeaturesSection";
import ServiceSection from "@/components/home/ServicesSection";
import CTASection from "@/components/home/CTASection";

function HomePage() {
  return (
    <div>
      <Banner />
      <FeaturesSection />
      <ServiceSection />
      <CTASection />
    </div>
  );
}

export default HomePage;
