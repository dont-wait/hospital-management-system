"use client";

import FeatureCard from "../shared/FeatureCard";
import FeatureImage from "@/public/images/feature-img.svg";
import { features } from "@/config";

export default function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-6">
      <div
        className="bg-contain bg-no-repeat bg-center col-span-2 md:col-span-1 h-[400px] md:h-[500px] lg:h-[700px]"
        style={{
          backgroundImage: `url(${FeatureImage.src})`,
        }}
      ></div>
      <div className="col-span-2 md:col-span-1 md:h-[500px] lg:h-[700px] flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl md:text-4xl text-center text-martinique font-bold">
          Tại sao chọn bệnh viện Medicare
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              featureIconName={feature.icon}
              featureTitle={feature.title}
              featureDescription={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
