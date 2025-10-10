import { Control, FieldErrors, Controller } from "react-hook-form";
import { Label } from "@/components/ui/shared/Label";
import { PatientUpdateDto } from "@/schemas/patient";
import { memo } from "react";

type GenderSectionProps = {
  control: Control<PatientUpdateDto>;
  errors: FieldErrors<PatientUpdateDto>;
};

const GENDER_OPTIONS = [
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
  { value: "Khác", label: "Khác" },
] as const;

const GenderSection = memo(function GenderSection({
  control,
  errors,
}: GenderSectionProps) {
  return (
    <div className="space-y-2">
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <div className="flex gap-6">
            {GENDER_OPTIONS.map(({ value, label }) => (
              <Label
                key={value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={value}
                  checked={field.value === value}
                  onChange={field.onChange}
                  className="w-4 h-4"
                />
                <span>{label}</span>
              </Label>
            ))}
          </div>
        )}
      />
      {errors.gender && (
        <p className="text-sm text-red-600">
          {errors.gender.message as string}
        </p>
      )}
    </div>
  );
});

export default GenderSection;
