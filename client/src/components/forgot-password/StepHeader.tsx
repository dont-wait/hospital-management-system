import { Button } from "@/components/shared/Button";
import { Progress } from "@/components/shared/Progress";
import { CardTitle, CardDescription } from "@/components/shared/Card";
import {
  getStepIcon,
  getStepTitle,
  getStepDescription,
} from "@/components/forgot-password/StepHelpers";
import { ArrowLeft } from "@/lib/client/utils";

interface StepHeaderProps {
  step: number;
  onGoBack: () => void;
}

export const StepHeader = ({ step, onGoBack }: StepHeaderProps) => (
  <>
    <div className="flex items-center justify-between">
      {1 < step && step < 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      )}
      <div className="flex-1" />
    </div>

    <Progress value={(step / 3) * 100} className="h-2" />

    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          {getStepIcon(step)}
        </div>
      </div>
      <div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          {getStepTitle(step)}
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          {getStepDescription(step)}
        </CardDescription>
      </div>
    </div>
  </>
);
