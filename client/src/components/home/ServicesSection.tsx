"use client";

import ServiceCard from "@/components/shared/ServiceCard";
import { services } from "@/config";
import ServiceImage from "@/public/images/service-img.svg";

export default function ServicesSection() {
  return (
    <div className="px-6 lg:px-14 py-6">
      <h2 className="font-bold text-center text-3xl text-martinique mb-6">
        Dịch vụ của chúng tôi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, idx) => (
          <ServiceCard
            key={idx}
            serviceTitle={service.title}
            serviceDescription={service.description}
          />
        ))}
      </div>

      <div
        className="mt-4 grid grid-cols-1 bg-no-repeat bg-center bg-contain mx-auto h-[400px] md:h-[500px] lg:h-[700px]"
        style={{
          backgroundImage: `url(${ServiceImage.src})`,
        }}
      ></div>
    </div>
  );
}
