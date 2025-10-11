import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, memo, lazy } from "react";
import { Button } from "@/components/ui/shared/Button";
import { LoadingSpinner } from "@/components/ui/shared/LoadingSpinner";
import { PatientUpdateDto, patientUpdateSchema } from "@/schemas/patient";

const AvatarSection = lazy(
  () => import("@/components/ui/patient/AvatarSection"),
);

const AddressSection = lazy(
  () => import("@/components/ui/patient/AddressSection"),
);

const GenderSection = lazy(
  () => import("@/components/ui/patient/GenderSection"),
);

const DateSection = lazy(() => import("@/components/ui/patient/DateSection"));

const PatientInfoSection = lazy(
  () => import("@/components/ui/patient/PatientInfoSection"),
);

interface PatientUpdateFormProps {
  onSubmit: (patientDto: PatientUpdateDto) => Promise<void>;
  isLoading: boolean;
  initialData: Partial<PatientUpdateDto>;
}

function UpdateForm({
  onSubmit,
  isLoading,
  initialData,
}: PatientUpdateFormProps) {
  const defaultValues = useMemo(
    () => ({
      address: initialData.address || "",
      avatarUrl: initialData.avatarUrl || "",
      dateOfBirth: initialData.dateOfBirth || "",
      email: initialData.email || "",
      firstName: initialData.firstName || "",
      gender: initialData.gender || "",
      lastName: initialData.lastName || "",
      nationality: initialData.nationality || "",
      phoneNumber: initialData.phoneNumber || "",
      placeOfResidence: initialData.placeOfResidence || "",
    }),
    [initialData],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<PatientUpdateDto>({
    resolver: zodResolver(patientUpdateSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <AvatarSection setValue={setValue} patient={initialData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Patient Info*/}
        <PatientInfoSection errors={errors} register={register} />

        {/* Address */}
        <AddressSection
          setValue={setValue}
          control={control}
          errors={errors}
          watch={watch}
          register={register}
          patient={initialData}
        />
      </div>

      {/* Date */}
      <DateSection
        setValue={setValue}
        errors={errors}
        defaultValue={defaultValues.dateOfBirth}
      />

      {/* Gender */}
      <GenderSection control={control} errors={errors} />

      {/* Submit button */}
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? (
          <LoadingSpinner text="Đang cập nhật..." />
        ) : (
          "Cập nhật thông tin"
        )}
      </Button>
    </form>
  );
}

export default memo(UpdateForm);
