import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import {
  UseFormSetValue,
  Control,
  FieldErrors,
  UseFormWatch,
  UseFormRegister,
  Controller,
} from "react-hook-form";
import { useEffect, memo, useCallback } from "react";
import { Label } from "@/components/ui/shared/Label";
import { ipGeoService } from "@/services/ipGeo.Service";
import { PatientUpdateDto } from "@/schemas/patient";

type AddressSectionProps = {
  setValue: UseFormSetValue<PatientUpdateDto>;
  control: Control<PatientUpdateDto>;
  errors: FieldErrors<PatientUpdateDto>;
  watch: UseFormWatch<PatientUpdateDto>;
  register: UseFormRegister<PatientUpdateDto>;
  patient: Partial<PatientUpdateDto>;
};

function AddressSection({
  setValue,
  control,
  errors,
  watch,
  register,
  patient,
}: AddressSectionProps) {
  const nationality = watch("nationality");

  useEffect(() => {
    const fetchCountryByIP = async () => {
      if (!patient?.nationality) {
        const country = await ipGeoService.getCountry();
        setValue("nationality", country ?? "");
      } else {
        setValue("nationality", patient.nationality ?? "");
      }
    };
    fetchCountryByIP();
  }, [patient.nationality, setValue]);

  const handleNationalityChange = useCallback(
    (val: string, onChange: (value: string) => void) => {
      onChange(val);
      setValue("placeOfResidence", "");
    },
    [setValue],
  );

  return (
    <>
      {/* Quốc tịch */}
      <div className="space-y-2">
        <Label htmlFor="nationality">Quốc tịch *</Label>
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <CountryDropdown
              value={field.value || ""}
              onChange={(val) => handleNationalityChange(val, field.onChange)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.nationality ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
        {errors.nationality && (
          <p className="text-sm text-red-600">
            {errors.nationality.message as string}
          </p>
        )}
      </div>

      {/* Nơi sinh */}
      <div className="space-y-2">
        <Label htmlFor="placeOfResidence">Nơi sinh *</Label>
        <Controller
          name="placeOfResidence"
          control={control}
          render={({ field }) => (
            <RegionDropdown
              country={nationality}
              value={field.value || ""}
              onChange={field.onChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.placeOfResidence ? "border-red-500" : "border-gray-300"
              }`}
              blankOptionLabel="-- Chọn nơi sinh --"
              defaultOptionLabel="-- Chọn nơi sinh --"
            />
          )}
        />
        {errors.placeOfResidence && (
          <p className="text-sm text-red-600">
            {errors.placeOfResidence.message as string}
          </p>
        )}
      </div>

      {/* Địa chỉ thường trú */}
      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ thường trú *</Label>
        <textarea
          id="address"
          placeholder="Nhập địa chỉ thường trú"
          rows={4}
          {...register("address")}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.address && (
          <p className="text-sm text-red-600">
            {errors.address.message as string}
          </p>
        )}
      </div>
    </>
  );
}

export default memo(AddressSection);
