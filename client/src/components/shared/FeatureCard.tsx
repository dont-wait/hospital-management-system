import Icon from "./Icon";
import { IconNames } from "@/types";

interface FeatureCardProps {
  featureTitle: string;
  featureDescription: string;
  featureIconName: IconNames;
}

export default function FeatureCard({
  featureTitle,
  featureDescription,
  featureIconName,
}: FeatureCardProps) {
  return (
    <div className="py-4 w-full flex flex-col items-center justify-center border-2 border-silver rounded-md shadow-md">
      <div className="px-6 py-2 flex flex-col items-center justify-center">
        <div className="w-12 h-12 mb-2">
          <Icon name={featureIconName} className="w-12 h-12 text-truev" />
        </div>
        <h3 className="text-xl font-semibold">{featureTitle}</h3>
      </div>
      <p className="text-center text-sm text-[#737373] px-6">{featureDescription}</p>
    </div>
  );
}
