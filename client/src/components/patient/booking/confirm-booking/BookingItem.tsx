"use client";

import { Icon } from "@/components/shared";
import { IconNames } from "@/types";

export default function BookingItem({
  icon,
  label,
  value,
  iconBg = "bg-gray-200",
  iconColor = "text-white",
}: {
  icon: IconNames;
  label: string;
  value: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon name={icon} className={`w-5 h-5 ${iconColor}`} />
      </div>

      <div>
        <p className="text-east-bay text-sm mb-1">{label}</p>
        <p className="text-martinique font-medium leading-snug">{value}</p>
      </div>
    </div>
  );
}
